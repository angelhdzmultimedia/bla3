import { cls, fn } from 'hardwired'
import type {FetchError} from 'ofetch'
import type { authData } from '~/src/shared/schemas/auth.schema'
import type { z } from '~/src/shared/utils/zod'

export class AuthStore {
  static providers = cls.singleton(this, [fn.singleton(() => useAuthApi)])
  isAuthenticated = ref<boolean>(false)
  user = ref<any>(null)
  status = ref<string>('idle')
  error = ref<FetchError>()

  constructor(private api: typeof useAuthApi) {}

  async login(email: string, password: string) {
    this.status.value = 'pending'
    this.error.value = undefined
     const {data, error, status} = await this.api('/api/auth/login', {
      mode: 'same-origin',
      credentials: 'include',
      body: {
        email,
        password
      },
      method: 'post'
    })

    this.status.value = status.value
    this.error.value = error.value

    if (status.value !== 'error') {
      this.isAuthenticated.value = true
      this.user.value = data.value
    }

    return {data, error, status}
  }

    async register(registerData: z.infer<typeof authData.register>) {
    this.status.value = 'pending'
    this.error.value = undefined
     const {data, error, status} = await this.api('/api/auth/register', {
      mode: 'same-origin',
      body: registerData,
      method: 'post'
    })

    this.status.value = status.value
    this.error.value = error.value

    

    return {data, error, status}
  }

  async getUser() {
    this.status.value = 'pending'
    this.error.value = undefined
    const {data, error, status} = await useAuthApi('/api/auth/user', {
      mode: 'same-origin',
      credentials: 'include',
      method: 'get'
    })

        this.status.value = status.value
    this.error.value = error.value

    if (status.value !== 'error') {
      this.isAuthenticated.value = true
      this.user.value = data.value
    }
  }

  async verify() {
    this.status.value = 'pending'
    this.error.value = undefined
    if (!this.isAuthenticated.value) {
      return false
    }
    if (this.user.value && this.user.value.isVerified) {
      return true
    }
    this.status.value = 'success'

    return false
  }

  async logout() {
    this.status.value = 'pending'
    this.error.value = undefined
    const {data, error, status} = await useAuthApi('/api/auth/logout', {
      mode: 'same-origin',
      credentials: 'include',
      method: 'post'
    })

        this.status.value = status.value
    this.error.value = error.value

    if (status.value !== 'error') {
      this.isAuthenticated.value = false
      this.user.value = undefined
    }
  }
}