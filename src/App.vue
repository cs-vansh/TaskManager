<script setup>
import ModuleShow from './components/ModuleShow.vue'
import TaskAddForm from '@/features/TaskAddForm.vue'
import InfoModal from './components/InfoModal.vue'
import EditModal from './components/EditModal.vue'
import TableHead from './components/TableHead.vue'
import SearchBar from './features/SearchBar.vue'
import DarkMode from './features/DarkMode.vue'
import ExportTasks from './features/ExportTasks.vue'

import { useTaskStore } from '@/stores/taskStore'
const taskStore = useTaskStore()

import '@material/web/button/filled-tonal-button.js'

// Although getgroupedTasks is a computed property, it will update the var but was not re rendering the UI
// this was dereferencing the computed property and using it as a variable
// const groupedTasks = taskStore.getgroupedTasks;
// instead of the above wrong way, use:

// const {getgroupedTasks} = storeToRefs(taskStore); //this doesn't break reactivity while destructuring
// import { storeToRefs } from 'pinia';
// or directly call taskStore.getgroupedTasks in the template as done here.

//removing trailing icon of the priority and status in mobile view
import { ref } from 'vue'
const isMobileView = ref(false)

// Function to check screen size
const checkScreenSize = () => {
  isMobileView.value = window.matchMedia('(max-width: 600px)').matches
}

import { onMounted, onUnmounted } from 'vue'
// Add event listeners to track screen size changes
onMounted(() => {
  checkScreenSize() // Initial check
  window.addEventListener('resize', checkScreenSize)
  console.log(isMobileView.value)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
  console.log(isMobileView.value)
})
</script>

<template>
  <div>
    <header>
      <div class="headerComponents">
        <h1 class="PageHeading">Task Manager</h1>

        <div class="headerComponent1">
          <DarkMode />
        </div>

        <div class="headerComponent2">
          <ExportTasks />
          <SearchBar />
        </div>

        <div class="headerComponent3">
          <md-filled-tonal-button class="addTaskButton" @click="taskStore.addIsClicked = true">
            <span
              style="display: inline-flex; align-items: center; gap: 0.3rem; margin-top: 0.5rem"
            >
              <md-icon>add</md-icon>
              Add Task
            </span>
          </md-filled-tonal-button>
        </div>

        <div class="headerComponent4">
          <TaskAddForm v-if="taskStore.addIsClicked && isMobileView === true" />
        </div>
      </div>
    </header>

    <main>
      <!-- Modals  -->
      <InfoModal />
      <EditModal />

      <table>
        <TableHead />

        <!-- add vif/ vshow  -->
        <TaskAddForm v-if="taskStore.addIsClicked && isMobileView === false" />

        <tbody>
          <!-- processedTasks is computed, which will have groupedTasks based on modules by default, if searching /sorting or both are used, they would be updated -->
          <ModuleShow
            v-for="(tasks, module) in taskStore.processedTasks"
            :key="module"
            :tasks="tasks"
            :moduleName="module"
          />
        </tbody>
      </table>
    </main>
  </div>
</template>

<style scoped></style>
