<script lang="ts" setup>
import { Notify } from 'quasar'
import { authData } from '../../../../shared/schemas/auth.schema'
import {z} from '../../../../shared/utils/zod'

definePageMeta({
  layout: 'main'
})

const auth = useAuth()
const registerForm = ref({
  firstName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

  

const {register} = {
  register: useAsyncData(() => auth.register(registerForm.value))
}

async function onSubmit() {
  await register.execute()
  if (auth.error.value) {
    Notify.create({
      message: auth.error.value.message,
      color: 'negative'
    })
  } else {
    navigateTo('/auth/login')
  }
}

function zodValidator<T extends z.ZodObject<any>>(schema: T) {
  return Object.fromEntries(Object.entries(schema.shape).map(([key, value]: [string, any]) => {
    return [key, (value: string) => {
      try {
        schema.shape[key].parse(value)
        return true
      } catch (error: unknown) {
        const zodError = error as z.ZodError
        return zodError.issues.map(issue => issue.message).toString()
      }
    }]
  }))
}

const formValidation = zodValidator(authData.register)


</script>

<template>
  <div>
    <span class="text-primary text-h5">Sign Up</span>
    <q-form @submit.prevent="onSubmit">
      <input-field :rules="[formValidation.firstName]" v-model="registerForm.firstName" filled label="First Name" icon="person"></input-field>
      <input-field :rules="[formValidation.email]" v-model="registerForm.email" filled label="Email" icon="email"></input-field>
      <password-input-field :rules="[formValidation.password]" v-model="registerForm.password" filled label="Password"></password-input-field>
      <password-input-field :rules="[formValidation.confirmPassword]" v-model="registerForm.confirmPassword" filled label="Confirm Password"></password-input-field>
      <q-btn type="submit" label="Sign Up" color="primary" ></q-btn>
      </q-form>
      <div class="text-negative">
        {{ auth.error.value?.data.message }}
      </div>
  </div>
</template>

<style scoped>

</style>