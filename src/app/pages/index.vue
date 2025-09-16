<script lang="ts" setup>
definePageMeta({
  middleware: ['auth', 'verify'],
  layout: 'main'
})

const auth = useAuth()
</script>

<template>
  <div class="column q-ma-md">
    Welcome, {{ auth.user.value?.firstName }}!
  </div>
</template>

<style scoped>

</style>