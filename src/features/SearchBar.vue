<script setup>
import { useTaskStore } from '@/stores/taskStore'

const taskStore = useTaskStore()

const handleClear = () => {
  taskStore.searchQuery = '' //clear the search query
}
</script>

<template>
  <!-- search field and button -->
  <div>
    <md-outlined-text-field label="Search" v-model="taskStore.searchQuery">
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <template slot="trailing-icon">
        <md-icon v-if="taskStore.searchQuery" @click="handleClear" style="cursor: pointer"
          >close</md-icon
        >
      </template>
    </md-outlined-text-field>
  </div>
</template>

<style scoped></style>
