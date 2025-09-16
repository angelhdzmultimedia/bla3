export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuth()
  const isVerified = await auth.verify()

  if (!isVerified && to.path !== '/auth/verify') {
    return navigateTo('/auth/verify')
  }
})
