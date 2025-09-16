import consola from 'consola'
import type { H3Event, SessionConfig } from 'h3';
import { cls } from 'hardwired'
import { users } from './auth.controller'

export type CanActivate = {
  canActivate(event: H3Event): boolean | Promise<boolean>
}

export const sessionOptions: SessionConfig = {
  password: 'asd9as0-d9-s0d9as0-das0d9sd9-wer9we8rew9r8ew0r8',
cookie:{
  secure: false,
  httpOnly: true,
  
}
}

export class AuthGuard implements CanActivate {
  static providers = cls.transient(this)
  async canActivate(event: H3Event) {
    const session = await useSession(event, sessionOptions)
    consola.log(`Session Data:  ${session.data.user}`)
    if (!session.data.user) {
      return false
    }
        
    return true
  }
}