import { cls } from "hardwired"
import  { AuthService } from "./auth.service"
import type { H3Event } from "h3"
import { AuthGuard, sessionOptions } from "./auth.guard"
import consola from "consola"
import { controller, decorate, route, useGuards, usePipes } from "~~/src/lib"
import {getQuery} from 'h3'
import { AuthSignInPipe, AuthSignUpPipe } from "./auth.pipe"

export const users: any[] = [
 
]

export class AuthController {
  static providers = cls.transient(this, [AuthService.providers])

  constructor(private authService: AuthService) {
    
  }

  async register(event: H3Event) {
    const registerData = await readBody(event)
    return this.authService.register(registerData)
  }

  async login(event: H3Event) {
   const body = await readBody(event)

   const user = users.find(user => user.email === body.email && user.password === body.password)
   if (!user) {
    throw createError({statusCode: 401, message: 'Invalid credentials'})
   }
   const session = await useSession(event, sessionOptions)
    await session.update(data => ({user: user.id}))
        consola.log(`Session Data: ${session.data.user}`)

    return user
  }

  async getUser(event: H3Event) {

    const session = await useSession(event, sessionOptions)
    const user = users.find(user => user.id === session.data.user)

    return user
  }

  async logout(event: H3Event) {
    const session = await useSession(event, sessionOptions)
    await session.clear()
    return true
  }

  async verify(event: H3Event) {
    const {token} = getQuery<{token: string}>(event)
      
    if (!token) {
      throw createError({statusCode: 400, message: 'Missing token'})
    }
    return this.authService.verify(token)
  }
}

decorate(AuthController, {
  class: [controller('/auth')],
  props: {
    login: [route.post('/login'), usePipes(AuthSignInPipe)],
    getUser: [route.get('/user'), useGuards(AuthGuard)],
    logout: [route.post('/logout')],
    verify: [route.get('/verify')],
    register: [route.post('/register'), usePipes(AuthSignUpPipe)]
  }
})