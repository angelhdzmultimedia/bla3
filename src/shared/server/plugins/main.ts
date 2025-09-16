import z from "zod"

declare module 'zod' {
  interface ZodString {
    atLeastOne(character: 'number' | 'uppercase' | 'symbol', options?: { message?: string }): this;
  }
}

type StringAtLeastOne = 
| 'string:at_least_one_number' 
| 'string:at_least_one_uppercase' 
| 'string:at_least_one_symbol'

z.ZodString.prototype.atLeastOne = function (character: 'number' | 'uppercase' | 'symbol', options?: { message?: string }) {
  let regex = new RegExp('')
  let message = ''

  if (character === 'number') {
    regex = /(?=.*[0-9])/g
    message = 'At least one number expected'
  } else if (character === 'uppercase') {
    regex = /(?=.*[A-Z])/g
    message = 'At least one uppercase letter expected'
  } else if (character === 'symbol') {
    regex = /(?=.*[!@#$%^&*])/g
    message = 'At least one symbol expected'
  }
  
  return this.superRefine((value: string, ctx: z.core.$RefinementCtx & {
    addIssue: (issue: Omit<z.core.$ZodIssue, 'expected'> & {
      expected: StringAtLeastOne, 
      }) => void}) => {
    
    if (!regex.test(value)) {
      ctx.addIssue({
        message,
        code: 'invalid_type',
        path: ['asd'],
        expected: `string:at_least_one_${character}`,

      })
    } else {
      
      return value
    }
  })
}

export default defineNitroPlugin(() => {
 
})

