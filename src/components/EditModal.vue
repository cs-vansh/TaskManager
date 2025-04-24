<script setup>
import '@material/web/dialog/dialog.js'
import '@material/web/button/filled-button.js'

import cloneDeep from 'lodash/cloneDeep'
import { ref, watch } from 'vue'
const dialogRef = ref(null)

// .show or .close for opening and closing the dialog box . given by material design

import { useTaskStore } from '@/stores/taskStore'
const taskStore = useTaskStore()

const original_taskData = ref(null) //creating a copy of taskData, will be used for comparison if the data is same or not

const taskData = ref(null)
const createdTime = ref(null)
const modifiedTime = ref(null)
const completedTime = ref(null)

watch(
  () => taskStore.editIsClicked,
  (newValue) => {
    if (newValue === true) {
      //can add loading state here

      //this is wrong, as both original_taskData and taskData point to the same object reference.
      // original_taskData.value = taskStore.getTaskbyId(taskStore.editIsClickedId);
      // taskData.value = taskStore.getTaskbyId(taskStore.editIsClickedId);

      /*Following issues when the above is done
        1. on updating values are updated even without clicking save and close
        2. data not changed is shown even when data is changed
        3. the modal shows new data that wasnt saved(old data is kept in the table) but modal shows updated data if reopened.
        
        Use cloneDeep from lodash instead
        */

      original_taskData.value = cloneDeep(taskStore.getTaskbyId(taskStore.editIsClickedId))
      taskData.value = cloneDeep(taskStore.getTaskbyId(taskStore.editIsClickedId))

      // ideally any of the created, modified, completed time won't change when the info modal is opened
      //had stored the dates as strings, so need to convert them to numbers before using new Date()
      if (taskData.value.createdTime) {
        createdTime.value = new Date(Number(taskData.value.createdTime)).toString()
      } else {
        createdTime.value = 'None'
      }
      if (taskData.value.modifiedTime) {
        modifiedTime.value = new Date(Number(taskData.value.modifiedTime)).toString()
      } else {
        modifiedTime.value = 'None'
      }
      if (taskData.value.completedTime) {
        completedTime.value = new Date(Number(taskData.value.completedTime)).toString()
      } else {
        completedTime.value = 'None'
      }

      dialogRef.value.show() //if I don't use onMounted, dialogRef.value will be null and will skip this silently
    } else {
      //new value could have of editIsClicked could also be false
      dialogRef.value.close()
    }
  },
)

const closeDialog = () => {
  taskStore.editIsClicked = false
  taskStore.editIsClickedId = null // reset the id of the task to be shown in the info modal
  // dialogRef.value.close();//no need as we are watching the value of this variable
}

//update modifiedTime as well
// using npm install lodash, for checking if 2objects are deeply equal

// was causing issues in vercel
//had to run npm install lodash.isequal separately(initially lodash.isequal was lodash/isequal)
import isEqual from 'lodash.isequal'
const saveData = () => {
  // comparing original_taskData and taskData returns false each time
  // comparing them as objects
  if (isEqual(original_taskData.value, taskData.value)) {
    closeDialog()
    console.log('data not changed')
  } else {
    //data updation
    taskData.value.modifiedTime = Date.now()
    if (original_taskData.value.status === 'Pending' && taskData.value.status === 'Completed') {
      taskData.value.completedTime = Date.now()
    }
    taskStore.updateTask(taskStore.editIsClickedId, taskData) //taskData represents the modified object here
    closeDialog()
    console.log('Data updated')
  }
}
</script>

<template>
  <div>
    <md-dialog ref="dialogRef" @closed="closeDialog">
      <!-- when taskdata is not null -->
      <!-- code crashes without this v-if condition -->
      <template v-if="taskData">
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <div slot="headline">
          <b>{{ taskData.module.slice(0, 10) }}{{ taskData.module.length > 15 ? '...' : '' }}</b> -
          {{ taskData.content.slice(0, 25) }}{{ taskData.content.length > 25 ? '...' : '' }}
        </div>
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <form slot="content">
          <md-outlined-text-field
            class="Textfield"
            v-model="taskData.content"
            label="Task/ Task content"
            type="textarea"
            rows="4"
            required
          ></md-outlined-text-field>
          <md-outlined-text-field
            class="Duration"
            v-model="taskData.duration"
            label="Duration (days)"
            type="number"
            rows="1"
            required
          ></md-outlined-text-field>
          <md-outlined-select
            class="select-field"
            v-model="taskData.priority"
            label="Priority"
            required
          >
            <md-select-option value="Low">Low</md-select-option>
            <md-select-option value="Medium">Medium</md-select-option>
            <md-select-option value="High">High</md-select-option>
          </md-outlined-select>
          <md-outlined-select
            class="select-field"
            v-model="taskData.status"
            label="Status"
            required
          >
            <md-select-option value="Pending">Pending</md-select-option>
            <md-select-option value="Completed">Completed</md-select-option>
          </md-outlined-select>

          <md-outlined-text-field
            class="Date"
            :value="createdTime"
            label="Created Time"
            type="text"
            rows="1"
            readonly
          ></md-outlined-text-field>
          <md-outlined-text-field
            class="Date"
            :value="modifiedTime"
            label="Modified Time"
            type="text"
            rows="1"
            readonly
          ></md-outlined-text-field>
          <md-outlined-text-field
            class="Date"
            :value="completedTime"
            label="Completed Time"
            type="text"
            rows="1"
            readonly
          ></md-outlined-text-field>
        </form>
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <div slot="actions">
          <md-filled-button @click="saveData">Save and Close</md-filled-button>
          <md-filled-button @click="closeDialog">Close</md-filled-button>
        </div>
      </template>
    </md-dialog>
  </div>
</template>

<style scoped></style>
