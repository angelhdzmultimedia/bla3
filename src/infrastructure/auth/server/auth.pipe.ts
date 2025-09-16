import { cls, fn } from "hardwired"
import z from "zod"
import { authData } from "~/src/shared/schemas/auth.schema"

/* async function usePipes(event: H3Event, pipes: any[]) {
  const body = await readBody(event)
  for (const pipe of pipes) {
    try {
      await pipe.parse(body)
    } catch (error) {
      throw createError({
        statusCode: 400,
        message: JSON.stringify((error as z.ZodError).issues),
      })
    }
  }
} */



export type ValidationPipe = {
  transform<T>(body: T): any
}

export class AuthSignInPipe implements ValidationPipe {
  static providers = cls.transient(this, [fn(() => authData.login)])

  constructor(private schema: z.ZodObject) {}

  transform<T>(body: T) {
    try {
      return this.schema.parse(body)
    } catch (error) {
      throw createError({
        statusCode: 400,
        message: JSON.stringify((error as z.ZodError).issues.map(issue => ({
          message: issue.message,
          path: issue.path,
          type: issue.code,
         input: issue.input

        }))),
      })
    }
  }
}

export class AuthSignUpPipe implements ValidationPipe {
  static providers = cls.transient(this, [fn(() => authData.register)])

  constructor(private schema: z.ZodObject) {}

  transform<T>(body: T) {
    try {
      return this.schema.parse(body)
    } catch (error) {
      throw createError({
        statusCode: 400,
        message: JSON.stringify((error as z.ZodError).issues.map(issue => ({
          message: issue.message,
          path: issue.path,
          type: issue.code,
         input: issue.input

        }))),
      })
    }
  }
}