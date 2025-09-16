import { cls } from "hardwired"
import  { AuthService } from "./auth.service"
import type { EventHandler, H3Event } from "h3"
import { sessionOptions } from "./auth.guard"
import consola from "consola"
import type { NuxtConfig } from "nuxt/schema"

function defineController(handlers: {}[], path: string) {

}

export const users = [
  {
    id: 1,
    email: 'angelhdz@gmail.com',
    password: '123123#A',
    firstName: 'Ángel'
  }
]





export async function login(event: H3Event) {
  const body = await readBody(event)

  const user = users.find(user => user.email === body.email && user.password === body.password)
  if (!user) {
  throw createError({statusCode: 401, message: 'Invalid credentials'})
  }
  const session = await useSession(event, sessionOptions)
  await session.update(data => ({user: user.id}))
      consola.log(`Session Data: ${session.data.user}`)

  return body
}

export async function getUser(event: H3Event) {

  const session = await useSession(event, sessionOptions)
  const user = users.find(user => user.id === session.data.user)

  return user
}

export async function logout(event: H3Event) {
  const session = await useSession(event, sessionOptions)
  await session.clear()
  return true
}

function defineRoute(route: Parameters<typeof defineController>[0][number]) {
  return route
}

export const authController =  defineController([
  defineRoute({
    route: 'login',
    method: 'post',
    handler: login
  }),

  defineRoute({
    route: 'user',
    method: 'get',
    handler: getUser
  }),

  defineRoute({
    route: 'logout',
    method: 'delete',
    handler: logout
  })
], '/api/auth')

