<script setup>
const props = defineProps({
  tasks: Array,
  moduleName: String,
})

import '@material/web/list/list-item.js'
import '@material/web/divider/divider.js'
import '@material/web/icon/icon.js'
import '@material/web/iconbutton/icon-button.js'
import '@material/web/checkbox/checkbox.js'

import TaskContent from './TaskContent.vue'

import { useTaskStore } from '@/stores/taskStore'
const taskStore = useTaskStore()

const handleInfo = (id) => {
  console.log(`id ${id} info clicked`)

  taskStore.infoIsClickedId = id // set the id of the task to be shown in the info modal
  taskStore.infoIsClicked = true

  // console.log(taskStore.infoIsClicked);
}

const handleEdit = (id) => {
  // console.log(`id ${id} edit clicked`);
  taskStore.editIsClickedId = id
  taskStore.editIsClicked = true
}

const handleDelete = (id) => {
  console.log(`id ${id} delete clicked`)

  taskStore.deleteTask(id)
}

//import { onUpdated } from 'vue';
// onUpdated(() => {
//   // This will run every time the component is updated
//   console.log(props.tasks);
//   console.log(props.moduleName);
// });

//was initially passing tasks present in the prop but if 1 completed task is searched, the module is checked which causes the issue
/*
//to check if all subtasks of a module are complete or not
const checkSubtasksCompleted = (tasks) => {
  // checking if all tasks are completed, if yes return true else false
  // return tasks.every(task => task.status === 'Completed');

  console.log('CheckSubtasksCompleted called')

  //better way to write this is using some() method and checking even if a single task is not completed.
  //it will short circuit faster
  // if any task is not completed, some() will return true and we invert the result in that case.
  //if all are completed, some() will keep returning false for all task in tasks (we invert result and return true in that case)
  return !tasks.some((task) => task.status !== 'Completed')
  //console.log("checksubtasksCompleted called")
}
*/

const moduleTasks = computed(() =>
  taskStore.tasks.filter((task) => task.module === props.moduleName),
)

const checkSubtasksCompleted = () => {
  // checking if all tasks are completed, if yes return true else false
  // return tasks.every(task => task.status === 'Completed');

  console.log('CheckSubtasksCompleted called')

  //better way to write this is using some() method and checking even if a single task is not completed.
  //it will short circuit faster
  // if any task is not completed, some() will return true and we invert the result in that case.
  //if all are completed, some() will keep returning false for all task in tasks (we invert result and return true in that case)
  return !moduleTasks.value.some((task) => task.status !== 'Completed')
  //console.log("checksubtasksCompleted called")
}

import { computed } from 'vue'
const subtasksCompleted = computed(() => checkSubtasksCompleted())

const handleModuleCheckbox = () => {
  //this function is called after the checkbox's value changes
  const newstatus = !subtasksCompleted.value
  // console.log("checkbox value",  newstatus);

  //if checkbox is checked, we need to set all tasks to completed
  //if checkbox is unchecked, we need to set all tasks to pending
  //props.task will contain all the tasks that are to be updated based on the module checkboxValue
  moduleTasks.value.forEach((task) => taskStore.updateViaModuleCheckbox(task.id, newstatus))
}
</script>

<template>
  <tr v-for="(task, index) in props.tasks" :key="index">
    <template v-if="index === 0">
      <th :rowspan="props.tasks.length">
        <span>
          <!-- 2 props were passed tasks and moduleName. tasks contain all tasks of that specific module -->
          <md-checkbox :checked="subtasksCompleted" @change="handleModuleCheckbox"></md-checkbox>
          {{ moduleName }}
        </span>
      </th>
    </template>

    <td>
      <!-- was unable to use v-model in checkboxes -->
      <!-- using prop to sending data of task and for checkbox's state (task.status) -->
      <!-- child component TaskContent will emit the event updateTaskStatusCheckbox, which will be used to update the actual TaskData -->
      <TaskContent
        :task="task"
        @updateTaskStatusCheckbox="
          (newStatus) => taskStore.updateViaModuleCheckbox(task.id, newStatus)
        "
      />

      <!--  the following code is now inside the TaskContent component  -->
      <!-- <span style="display: inline-flex; align-items: center; gap: 0.3rem;">
            <md-checkbox v-model="task.isCompleted"></md-checkbox>
            {{ task.content }}
          </span> -->
    </td>

    <td>{{ task.duration }} days</td>
    <td>{{ task.priority }}</td>
    <td>{{ task.status }}</td>
    <td>
      <span class="actionButtons">
        <md-icon-button @click="handleInfo(task.id)">
          <md-icon>info</md-icon>
        </md-icon-button>
        <md-icon-button @click="handleEdit(task.id)">
          <md-icon>Edit</md-icon>
        </md-icon-button>
        <md-icon-button @click="handleDelete(task.id)">
          <md-icon>delete</md-icon>
        </md-icon-button>
      </span>
    </td>
  </tr>
</template>

<style scoped></style>
