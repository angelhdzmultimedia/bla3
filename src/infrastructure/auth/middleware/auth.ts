export default defineNuxtRouteMiddleware(async (to, from) => {
    if (to.path === '/auth/login' || to.path === '/auth/register') {
      return;
    }

    const auth = useAuth()
    await auth.getUser()
    if (!auth.isAuthenticated.value) {
      return navigateTo('/auth/login')
    }
})