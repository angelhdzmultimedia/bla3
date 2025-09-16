<script lang="ts" setup>
import { Notify } from 'quasar'

import { authData } from '../../../../shared/schemas/auth.schema'
import {z} from '../../../../shared/utils/zod'
definePageMeta({
  layout: 'main'
})

const auth = useAuth()
const loginForm = ref({
  email: '',
  password: ''
})

  

const {login} = {
  login: useAsyncData(() => auth.login(loginForm.value.email, loginForm.value.password))
}

async function onSubmit() {
  await login.execute()
  if (auth.error.value) {
    Notify.create({
      message: auth.error.value.message,
      color: 'negative'
    })
  } else {
    navigateTo('/')
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

const formValidation = zodValidator(authData.login)

</script>

<template>
  <div>
    <span class="text-primary text-h5">Sign In</span>
    <q-form @submit.prevent="onSubmit">
      <input-field :rules="[formValidation.email]" v-model="loginForm.email" filled label="Email" icon="email"></input-field>
      <password-input-field :rules="[formValidation.password]" v-model="loginForm.password" filled label="Password"></password-input-field>
      <q-btn type="submit" label="Sign In" color="primary" ></q-btn>
      </q-form>
      <div class="text-negative">
        {{ auth.error.value?.data.message }}
      </div>
  </div>
</template>

<style scoped>

</style>