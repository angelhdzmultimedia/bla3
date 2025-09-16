<script lang="ts" setup>
import { Notify } from 'quasar'

const auth = useAuth()
const theme = useTheme()

await theme.init()

async function onLogoutButtonClick() {
  await auth.logout()
  if (auth.error.value) {
      Notify.create({
      message: auth.error.value.message,
      color: 'negative'
    })
  } else {
    navigateTo('/auth/login')
  }
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn to="/" flat dense round icon="fas fa-house" aria-label="Menu" />
        <q-toolbar-title>
          Blog
        </q-toolbar-title>
         <div class="row items-center">
          <q-btn flat :icon="theme.isDark.value ? 'dark_mode' : 'light_mode'" class="cursor-pointer" @click="theme.toggle()" />
        <q-avatar  color="white" class="cursor-pointer">
          <img v-if="auth.isAuthenticated.value" src="https://cdn.quasar.dev/img/boy-avatar.png">
          <q-icon v-if="auth.isAuthenticated.value" size="sm" color="light-green-6" name="admin_panel_settings" style="top: 0; left: 25px; position: absolute;" />  
          <q-menu>
            <q-list>
              <q-item clickable v-close-popup>
                <q-item-section>Profile</q-item-section>
              </q-item>
              <q-item @click="onLogoutButtonClick" v-if="auth.isAuthenticated.value" clickable v-close-popup>
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-avatar>
      </div>
      </q-toolbar>
     
    </q-header>

    <q-page-container>
      <slot/>
    </q-page-container>

  </q-layout>
</template>

<style scoped>

</style>