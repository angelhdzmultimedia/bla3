import consola from "consola"
import  { type Definition, type LifeTime, container } from "hardwired"
import type { CanActivate } from "~/src/infrastructure/auth/server/auth.guard"
import type { ValidationPipe } from "~/src/infrastructure/auth/server/auth.pipe"
import { type decorate, type Controller, type ClassType, decoMetadata } from "~~/src/lib"

export function defineController<T>(classType: ClassType<T>) {
      type Args = ConstructorParameters<new (...args: any[]) => T>
  const metadata = decoMetadata(classType)
const target = classType as any as Function & {providers: Definition<T, LifeTime, Args> }
  const {path} = metadata.class.getOne<Controller>({type: 'controller'})

  const routes = metadata.prop.getAll('*', {type: 'route'})
  consola.info(`${target.name} controller registered.`)
  routes
  .map(route => ({...route, httpMethod: route.httpMethod.toUpperCase(), path: `/api/${path ?? ''}/${route.path}`.replaceAll('//', '/')}))
  .map(route => consola.success(`[${route.httpMethod}]: ${route.path} route registered.`))
  
  return defineEventHandler(async (event) => {
    const route = routes.find(route => 
      route.httpMethod.toUpperCase() === event.method 
      && event.path.startsWith(`/api/${path ?? ''}/${route.path}`.replaceAll('//', '/'))
    )
    
    if (!route) {
      throw createError({statusCode: 404, message: 'Route not found'})
    }
    const body = event.method !== 'GET' ? await readBody(event) : {}
    const pipes = (metadata.prop.getOne<{pipes: any[]}>(route.name, {type: 'pipes'})?.pipes ?? [])
      .map((pipe: ValidationPipe & Function & {providers: Definition<ValidationPipe, LifeTime, any[]>}) => {
        return async (body: any) => {
          const _pipe = container.use(pipe.providers)
          consola.info(`Mapping ${route.name} pipes ${pipe.name}`)
          await Promise.resolve(_pipe.transform(body))

        }
      })

       const guards = (metadata.prop.getOne<{guards: any[]}>(route.name, {type: 'guards'})?.guards ?? [])
      .map((guard: CanActivate & Function & {providers: Definition<CanActivate, LifeTime, any[]>}) => {
        return async (body: any) => {
          const _guard = container.use(guard.providers)
           consola.info(`Mapping ${route.name} guards ${guard.name}`)
          const result = await Promise.resolve(_guard.canActivate(body))
          if (result === false) {
            throw createError({statusCode: 401, message: 'Unauthorized'})
          }
        }
      })
      for (const pipe of pipes) {
        await pipe(body)
      }

      for (const guard of guards) {
        await guard(event)
      }
    const controller = container.use(target.providers)
    const handler = controller[route.name as keyof T] as Function
    
    return handler.apply(controller, [event])
  })
}