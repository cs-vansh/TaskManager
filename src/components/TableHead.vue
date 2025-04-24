<script setup>
import { useTaskStore } from '@/stores/taskStore'

const taskStore = useTaskStore()
</script>

<template>
  <thead>
    <tr>
      <th>Module</th>
      <th>Contents</th>
      <th @click="() => taskStore.updateSortBy('duration')">
        <!--  @click="taskStore.updateSortBy('duration')" doesnt work-->
        <!-- we call func() by @click="func" and not @click="func()" as its called on each render -->

        <div class="durationHeading">
          <!-- either could have done @click="taskStore.updateSortBy(String('duration'))" or else define arrow func -->
          <span>Duration</span>
          <span>
            <md-icon v-if="taskStore.durationSortBy === 'none'"> reorder </md-icon>
            <md-icon v-if="taskStore.durationSortBy === 'ascending'" style="transform: scaleY(-1)"
              >sort</md-icon
            >
            <md-icon v-if="taskStore.durationSortBy === 'descending'">sort</md-icon>
          </span>
        </div>
      </th>
      <th @click="() => taskStore.updateSortBy('priority')">
        <div class="priorityHeading">
          <span>Priority</span>
          <span>
            <md-icon v-if="taskStore.prioritySortBy === 'none'"> reorder </md-icon>
            <md-icon v-if="taskStore.prioritySortBy === 'ascending'" style="transform: scaleY(-1)"
              >sort</md-icon
            >
            <md-icon v-if="taskStore.prioritySortBy === 'descending'">sort</md-icon>
          </span>
        </div>
      </th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
</template>

<style scoped></style>
