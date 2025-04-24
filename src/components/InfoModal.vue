<script setup>
import '@material/web/dialog/dialog.js'
import '@material/web/button/filled-button.js'

import { ref, watch } from 'vue'
const dialogRef = ref(null)

// .show or .close for opening and closing the dialog box . given by material design

import { useTaskStore } from '@/stores/taskStore'
const taskStore = useTaskStore()

const taskData = ref(null)
const createdTime = ref(null)
const modifiedTime = ref(null)
const completedTime = ref(null)

watch(
  () => taskStore.infoIsClicked,
  (newValue) => {
    if (newValue === true) {
      //can add loading state here

      taskData.value = taskStore.getTaskbyId(taskStore.infoIsClickedId)

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
      //new value could have of infoIsClicked could also be false
      dialogRef.value.close()
    }
  },
)

const closeDialog = () => {
  taskStore.infoIsClicked = false
  taskStore.infoIsClickedId = null // reset the id of the task to be shown in the info modal

  // dialogRef.value.close();//no need as we are watching the value of this variable
}

const editData = () => {
  if (taskStore.infoIsClickedId) {
    taskStore.editIsClickedId = taskStore.infoIsClickedId
  }
  taskStore.editIsClicked = true

  taskStore.infoIsClickedId = null // reset the id of the task
  taskStore.infoIsClicked = false // close the info modal when edit modal is opened
}
</script>

<template>
  <!-- @closed is emitted each time the dialog is closed, ensuring the variables are updated even when the dialog is closed by pressing escape or clicking outside the modal -->
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
          :value="taskData.content"
          label="Task/ Task content"
          type="textarea"
          rows="4"
          required
          readonly
        ></md-outlined-text-field>
        <md-outlined-text-field
          class="Duration"
          :value="taskData.duration"
          label="Duration (days)"
          type="number"
          rows="1"
          required
          readonly
        ></md-outlined-text-field>

        <!-- Select option doesnt have readonly, so using text field instead -->
        <md-outlined-text-field
          class="select-field"
          :value="taskData.priority"
          label="Priority"
          required
          readonly
        >
        </md-outlined-text-field>
        <md-outlined-text-field
          class="select-field"
          :value="taskData.status"
          label="Status"
          required
          readonly
        >
        </md-outlined-text-field>

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
        <md-filled-button @click="editData">Edit</md-filled-button>
        <md-filled-button @click="closeDialog">OK</md-filled-button>
      </div>
    </template>
  </md-dialog>
</template>

<style scoped></style>
