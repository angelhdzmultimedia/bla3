import {z} from '../../shared/utils/zod'

export const authData = {
  login: z.object({
    email: z.email().min(1),
    password: z.string().min(6).max(16).atLeastOne('number').atLeastOne('uppercase').atLeastOne('symbol'),
  }),

  register: z.object({
    email: z.email().min(1),
    password: z.string().min(6).max(16).atLeastOne('number').atLeastOne('uppercase').atLeastOne('symbol'),
    firstName: z.string().min(1),
    confirmPassword: z.string()
  }).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ['confirmPassword']
    });
  }
}),
}
