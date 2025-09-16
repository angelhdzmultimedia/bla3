<script lang="ts" setup>
definePageMeta({
  layout: 'main',
  middleware: ['auth', 'verify']
})
const auth = useAuth()
</script>

<template>
  <div class="column items-center q-mt-lg text-h6">
     <span>Welcome, <span class="text-primary">{{ auth.user.value?.firstName }}</span>!</span>
    <div class="row items-center">
     
     
    <span>
      Account Status: 
    <q-chip :color="auth.user.value?.isVerified ? 'green' : 'red'" text-color="white">{{ auth.user.value?.isVerified ? 'Verified' : 'Not Verified' }}</q-chip>
    </span>
    </div>
    Check your email for a verification link.
  </div>
</template>

<style scoped>

</style>