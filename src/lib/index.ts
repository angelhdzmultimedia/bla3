import type { SessionOptions } from 'express-session'
import { Server } from 'node:http'
import express from 'express'
import expressSession from 'express-session'

export const httpMethods = ['get', 'post', 'put', 'patch', 'delete', 
  'connect', 'options', 'trace', 'head'] as const

export type HttpMethod = typeof httpMethods[number] | Uppercase<typeof httpMethods[number]>

export type ClassType<T = any> = new (...args: any[]) => T

type DecorationData<T> = {
  target: ClassType<T>
  metadata: {
    class: any[]
    props: Record<keyof T, any[]>
  }
}



type Decorators<T> = {
  class: any[]
  props: Record<keyof T, any[]>
}

class Decoration {
  private static registry = new WeakMap<ClassType, DecorationData<any>>()

  static decorateClass<T>(classType: ClassType<T>, ...decorators: any[]) {
    const record = this.getOrCreateRecord(classType)
    decorators.forEach(decorator => {
      const decoratorData = decorator({target: classType, name: classType.name})
      record.metadata.class.push(decoratorData)
      events.emit(classType, `decorate:class@${decoratorData.type}`, decoratorData)
    })
  }

  static decorateProp<T>(classType: ClassType<T>, prop: keyof T, ...decorators: any[]) {
    const record = this.getOrCreateRecord(classType)
    if (!record.metadata.props[prop]) {
      record.metadata.props[prop] = []
    }
    decorators.forEach(decorator => {
      const decoratorData = decorator({target: classType, name: prop})
 
      record.metadata.props[prop].push(decoratorData)
      events.emit(classType, `decorate:prop:${String(prop)}@${decoratorData.type}`, decoratorData)
      events.emit(classType, `decorate:prop@${decoratorData.type}`, decoratorData)
    })
    events.emit(classType, `decorate:prop:${String(prop)}`, {name: prop})
    events.emit(classType, 'decorate:prop', {name: prop})
    
  }

  static useMetadata<T>(classType: ClassType<T>) {
    const decorationData = Decoration.registry.get(classType)

    return {
      metadata: decorationData?.metadata,
      target: classType,
      class: {
        getAll<Items extends any[]>(selector?: any) {
          return (decorationData?.metadata?.class.filter(decorator => !selector || Object.keys(selector).every(key => decorator[key] === selector[key])) ?? []) as ClassDecoratorData<Items>
        },
        getOne<Item extends any>(selector?: any) {
          return this.getAll(selector)[0] as ClassDecoratorData<Item>
        }
      },
      prop: {
        getAll<Items extends any[]>(prop: keyof T | '*', selector?: any) {
          if (prop === '*') {
            return Object.values(decorationData?.metadata.props ?? {}).flat().filter(decorator => !selector || Object.keys(selector).every(key => decorator[key] === selector[key])) as ClassDecoratorData<Items>[]
          }
          return (decorationData?.metadata.props[prop]?.filter(decorator => !selector || Object.keys(selector).every(key => decorator[key] === selector[key])) ?? []) as Items
        },
        getOne<Item extends any>(prop: keyof T | '*', selector?: any) {
          return this.getAll(prop, selector)[0] as ClassDecoratorData<Item>
        }
      }
    }
  }

  static getDecorationData<T>(classType: ClassType<T>): DecorationData<T> | undefined {
    return this.registry.get(classType)
  }



  static create<T>(classType: ClassType<T>, decorators: Decorators<T>) {
    for (const prop in decorators.props) {
      this.decorateProp(classType, prop, ...decorators.props[prop])
    }

    for (const decorator of decorators.class) {
      this.decorateClass(classType, decorator)
    }
    emit(classType, 'decorate:done')
  }

  private static getOrCreateRecord<T>(classType: ClassType<T>): DecorationData<T> {
    if (!this.registry.has(classType)) {
      this.registry.set(classType, { target: classType, metadata: { class: [], props: {} } })
    }
    return this.registry.get(classType)!
  }
}

export function post(path?: string) {
  return ({target, name}: any) => {
    return {
      name,
      path,
      httpMethod: 'POST',
      type: 'route'
    }
  }
}


export function params(decorators: any[]) {
  return ({target, name}: any) => {
    return {
      type: 'params',
      decorators: decorators.map(decorator => decorator({target, name}))
    }
  }
}

export type Guard = {
  canActivate: (ctx: any) => boolean | Promise<boolean>
}

export function useGuards(...guards: any[]) {
  return ({target, name}: any) => {
    return {
      type: 'guards',
      guards
    }
  }
}

export function usePipes(...pipes: any[]) {
  return ({target, name}: any) => {
    return {
      type: 'pipes',
      pipes
    }
  }
}

export function body(data?: any) {
  return ({target, name}: any) => {
    return {
      type: 'body',
      data
    }
  }
}

export type Controller = {
 path?: string 
}

type ClassDecoratorData<Options extends any | any[]> = {type: string} & Options

type ClassDecorator<Options = any, T = unknown> = (ctx: {target: ClassType<T>, name: string}) => ClassDecoratorData<Options>
export function controller<T>(path?: string): ClassDecorator<Controller, T> {
  return (ctx) => {
    return {
      path, 
      type: 'controller'
    } 
    
  }
}


export function httpCode(code: number) {
  return ({target, name}: any) => {
    return {
      code,
      type: 'httpCode'
    }
  }
}

export type TDecoration = ReturnType<typeof Decoration.create>

export function get(path?: string) {
  return ({target, name}: any) => {
    return {
      name,
      path,
      httpMethod: 'GET',
      type: 'route'
    }
  }
}

export function _delete(path?: string) {
  return ({target, name}: any) => {
    return {
      name,
      path,
      httpMethod: 'DELETE',
      type: 'route'
    }
  }
}

export const route = {
  delete: _delete,
  get,
  post,
  usePipes,
  useGuards,
}

export type Group = {
  controllers?: ClassType<any>[]
  groups?: ClassType<any>[]
  providers?: ClassType<any>[]
}


export function group<T>(options?: Group): ClassDecorator<Group, T> {
  return (ctx) => {
    return {
      ...options as Group,
      type: 'group',
    }
  }
}



export const decoCreate = Decoration.create.bind(Decoration)
export const decoMetadata = Decoration.useMetadata
export const decorate = decoCreate
export const deco = decorate


export function on<T>(event: string, target: ClassType<T>, handler: Function) {
  decoMetadata(target).metadata?.class.push({
    event, handler,
    
    type: 'event'
  })
}

export function emit<Data = any, T = unknown>(target: ClassType<T>, event: string, data?: Data) {
  setTimeout(() => {
    const events = decoMetadata(target).class.getAll({type: 'event'}) ?? []
    
    for (const item of events) {
   
      if (item.event === event) {
        item.handler(data)
      }
    }
  }, 1)
}

export const events = {
  on,
  emit,
  for<T>(target: ClassType<T>) {
    return {
      on(event: string, handler: Function) {
        on(event, target, handler)
        return this
      },
      emit(event: string, data?: any) {
        emit(target, event, data)
        return this
      }
    }
  }
}

export type AppOptions = {
  port?: number
  appGroup: ClassType<any>
}

export function app<T>(options?: AppOptions): ClassDecorator<AppOptions, T> {
  return (ctx: any) => {
    return {
      type: 'app',
      ...options as AppOptions,
    }
  }
}



export function session(options?: SessionOptions) {
  return (ctx: any) => {
    return {
      name: ctx.name,
      target: ctx.target,
      type: 'middleware',
      handler: expressSession(options),
    }
  }
}


export function parseController<T>(app: express.Express, controller: ClassType<T>) {
  const controllerMetadata = decoMetadata(controller)
    const controllerData = controllerMetadata.class.getOne<Controller>({type: 'controller'})
    
    const routes = controllerMetadata.prop.getAll('*', {type: 'route'})

    routes.forEach(route => {

      const params = controllerMetadata.prop.getOne<{decorators: any[]}>(route.name, {type: 'params'}) ?? []
      
      const path = `/${controllerData.path ?? ''}/${route.path ?? ''}`.replaceAll('//', '/')
      console.log(path)
      app[route.httpMethod.toLowerCase() as keyof express.Express](path, async (req: express.Request, res: express.Response) => {
        const args = params.decorators.map(param => {
          console.log(param)
          if (param.type === 'body') {
        
            return param.data ? req.body[param.data] :  req.body
          }
         
        })
        const result = await controller.prototype[route.name].apply(controller.prototype, [...args])
        res.send(result)
      })
    })
}

export function parseGroup<T>(app: express.Express, group: ClassType<T>) {
  const groupOptions = decoMetadata(group).class.getOne<Group>({type: 'group'})
  for (const controller of groupOptions.controllers ?? []) {
    parseController(app, controller)
  }
  for (const subGroup of groupOptions.groups ?? []) {
    parseGroup(app, subGroup)
  }
}






export class DecorationEvent {
  static done = 'decorate:done'

  static filter(type: string) {
    return `@${type}`
  }
}

export class ClassDecorationEvent extends DecorationEvent {
  static decorated = 'decorate:class'

  static override filter(type: string) {
    return `decorate:class${super.filter(type)}`
  }
}

export class MethodDecorationEvent extends DecorationEvent {
  static decorated = 'decorate:method'

  static override filter(type: string) {
    return `decorate:method${super.filter(type)}`
  }

  static namedFilter(method: string, type: string) {
    return `decorate:method:${method}${super.filter(type)}`
  }

  static named(method: string) {
    return `decorate:method:${method}`
  }
}

export function listen(classType: ClassType<any>) {
  const { promise, resolve, reject } = Promise.withResolvers<Server>()
  const app = express()
  events.on(ClassDecorationEvent.filter('app'), classType, () => {

    const {port, appGroup} = decoMetadata(classType).class.getOne<AppOptions>({type: 'app'})
    console.log(port)
    const middleware = decoMetadata(classType).prop.getAll('*', {type: 'middleware'})
    app.use(express.json())

    for (const item of middleware) {
      app.use(item.handler)
    }

    parseGroup(app, appGroup)
    
    const server = app.listen(port, () => {
      console.log(`Server started on port ${port}...`)
      resolve(server)
      events.for(classType).emit(ClassDecorationEvent.filter('listen'), {port, appGroup})
    })
  })
  
  return promise
}