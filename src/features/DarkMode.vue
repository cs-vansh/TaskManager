<script setup>
import '@material/web/switch/switch.js'

import { useTaskStore } from '@/stores/taskStore'
import { watch } from 'vue'
const taskStore = useTaskStore()

// dynamically applying darkMode to the entire page instead of a particular div.
watch(
  () => taskStore.isDarkMode,
  (newVal) => {
    if (newVal === true) {
      document.documentElement.classList.add('darkMode')
    } else {
      document.documentElement.classList.remove('darkMode')
    }
  },
)
</script>

<template>
  <label class="darkModeButton">
    <b>Dark Mode</b>
    <md-switch @change="taskStore.toggleDarkMode"></md-switch>
  </label>
</template>

<style scoped></style>
