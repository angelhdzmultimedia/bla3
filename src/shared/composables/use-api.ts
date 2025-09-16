import type {KebabCase, Replace} from 'type-fest'
import type {NitroFetchOptions, NitroFetchRequest} from 'nitropack'

type ResponseData = {
  data: Ref<any>
  error: Ref<any>
  status: Ref<'idle' | 'pending' | 'success' | 'error'>
}

export const useApi = async <Url extends string>(url: Url, options?: NitroFetchOptions<NitroFetchRequest>) => {
  const response = {data: ref<any>(null), error: ref<any>(null), status: ref<'idle' | 'pending' | 'success' | 'error'>('idle')} as ResponseData
  response.status.value = 'pending'
  try {
    response.data.value = await $fetch(url, {...options} as any)
    response.status.value = 'success'
  } catch (error) {
    response.error.value = error
    response.status.value = 'error'
  }
  return response
}

