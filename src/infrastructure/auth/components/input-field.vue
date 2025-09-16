<script lang="ts" setup>
import type { ValidationRule } from 'quasar'

const icon = defineModel<string>('icon')
const modelValue = defineModel<string>()
const attrs = useAttrs()
</script>

<template>
  <div>
    <q-input  v-bind="attrs"  v-model="modelValue">
      <template v-slot:prepend>
        <q-icon :name="icon" />
      </template>
    </q-input>
  </div>
</template>

<style scoped>

</style>