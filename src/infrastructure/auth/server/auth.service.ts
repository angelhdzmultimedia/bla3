import { cls } from "hardwired"
import { EmailService } from '../../email/server/api/email/email.service'
import { users } from "./auth.controller"


export class AuthService {
  static providers = cls.transient(this, [EmailService.providers])

  constructor(private readonly emailService: EmailService) {

  }

  register(registerData: any) {
    const token = Math.random().toString(36).slice(2)
    users.push({...registerData, token, isVerified: false})
    this.sendVerificationEmail(registerData.email, token)
    return registerData
  }

  sendVerificationEmail(email: string, token: string) {
    this.emailService.sendEmail({
      to: email,
      subject: 'AHdz Blog - Verify your account',
      text: `Visit this link to verify your account: http://localhost:3000/api/auth/verify?token=${token}`
    })
  }

  verify(token: string) {
    const user = users.find(user => user.token === token)
    if (user) {
      user.isVerified = true
      return true
    }
    return false
  } 
}


