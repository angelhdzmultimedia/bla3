<script lang="ts" setup>
const isHidden = ref(true)
const modelValue = defineModel<string>()
const attrs = useAttrs()
</script>

<template>
  <div>
    <q-input v-bind="attrs" filled :type="isHidden ? 'password' : 'text'" v-model="modelValue" >
      <template v-slot:append>
        <q-icon
          :name="isHidden ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isHidden = !isHidden"
        />
      </template>

      <template v-slot:prepend>
        <q-icon name="key" />
      </template>
    </q-input>
  </div>
</template>

<style scoped>

</style>