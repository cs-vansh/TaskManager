<script setup>
import { onUnmounted, reactive, ref } from 'vue'

import '@material/web/textfield/outlined-text-field.js'
import '@material/web/select/outlined-select.js'
import '@material/web/select/select-option.js'

import { useTaskStore } from '@/stores/taskStore'
const taskStore = useTaskStore()

import { v4 as uuidv4 } from 'uuid' // for generating unique ids

// form data
const moduleName = ref('')
const taskContent = ref('')
const duration = ref(1)
const priority = ref('Low')
const status = ref('Pending')

const handleAdd = () => {
  //Whenever I reclick Add button, I want errors to be updated(added as well as removed)
  //resetting the errors before evaluation of validateFormData()

  // reset all errors
  errors.moduleName = ''
  errors.taskContent = ''
  errors.duration = ''
  errors.priority = ''
  errors.status = ''

  // define form validation rules/function here
  if (!validateFormData()) {
    return
  }

  const formData = {
    id: uuidv4(), // generate unique id for each task when handleAdd is called
    module: moduleName.value.trim(),
    content: taskContent.value.trim(),
    duration: duration.value,
    priority: priority.value,
    status: status.value,
    createdTime: Date.now(), //adding the time when the component was added
    modifiedTime: '',
    completedTime: status.value === 'Completed' ? Date.now() : '',
  }

  // console.log(formData);
  taskStore.addTask(formData)

  // reset all refs defined above at top:
  moduleName.value = ''
  taskContent.value = ''
  duration.value = 1
  priority.value = 'Low'
  status.value = 'Pending'
}

//errors to show on validating form data - if any
const errors = reactive({
  moduleName: '',
  taskContent: '',
  duration: '',
  priority: '',
  status: '',
})

const validateFormData = () => {
  let isValid = true

  if (!moduleName.value.trim()) {
    errors.moduleName = 'Module name is required'
    isValid = false
  }

  if (!taskContent.value.trim()) {
    errors.taskContent = 'Task content is required'
    isValid = false
  }

  if (!duration.value || Number(duration.value) <= 0 || isNaN(duration.value)) {
    errors.duration = 'Pick a valid duration value'
    isValid = false
  }

  // const priorities = ['Low', 'Medium', 'High'];
  // const statuses = ['Pending', 'Completed'];
  // would have to check with priorities.includes(priority.value)

  // instead using object (map) for faster lookup
  const priorities = {
    Low: true,
    Medium: true,
    High: true,
  }
  const statuses = {
    Pending: true,
    Completed: true,
  }

  // generally priority and status would be present by default, but if request intercepted, can be removed or modified
  //if priority.value doesnt exist in priorities -> it will return undefined
  // and !undefined will return true
  if (!priority.value || !priorities[priority.value]) {
    errors.priority = 'Pick a valid value'
    isValid = false
  }

  if (!status.value || !statuses[status.value]) {
    errors.status = 'Pick a valid value'
    isValid = false
  }

  return isValid
}

const handleRemove = () => {
  taskStore.addIsClicked = false // remove the add task row from the table
}
</script>

<template>
  <!-- All user input data goes here -->
  <tr class="addFormRow">
    <!-- check helper-text field -->
    <td>
      <!-- removed value="" as we are using v-model, if both are kept, both interfere with each other -->
      <md-outlined-text-field
        class="moduleName"
        v-model="moduleName"
        :error="errors.moduleName ? true : false"
        :error-text="errors.moduleName"
        label="Module Name"
        type="text"
        rows="1"
        required
      ></md-outlined-text-field>
    </td>
    <td>
      <md-outlined-text-field
        class="taskContent"
        v-model="taskContent"
        :error="errors.taskContent ? true : false"
        :error-text="errors.taskContent"
        label="Task/ Task content"
        type="textarea"
        rows="2"
        required
      ></md-outlined-text-field>
    </td>
    <td>
      <md-outlined-text-field
        class="duration"
        v-model="duration"
        :error="errors.duration ? true : false"
        :error-text="errors.duration"
        label="Duration (days)"
        type="number"
        rows="1"
        required
      ></md-outlined-text-field>
    </td>
    <td>
      <md-outlined-select
        class="selectFields"
        v-model="priority"
        :error="errors.priority ? true : false"
        :error-text="errors.priority"
        label="Priority"
        required
      >
        <!-- using selected interefers with the v-model's reactivity -->
        <!-- <md-select-option selected value="Low">Low</md-select-option> -->
        <md-select-option value="Low">Low</md-select-option>
        <md-select-option value="Medium">Medium</md-select-option>
        <md-select-option value="High">High</md-select-option>
      </md-outlined-select>
    </td>

    <td>
      <md-outlined-select
        class="selectFields"
        v-model="status"
        :error="errors.status ? true : false"
        :error-text="errors.status"
        label="Status"
        required
      >
        <md-select-option value="Pending">Pending</md-select-option>
        <md-select-option value="Completed">Completed</md-select-option>
      </md-outlined-select>
    </td>

    <td>
      <div class="actionButtons">
        <div style="display: flex; flex-direction: column; gap: 1rem">
          <md-filled-tonal-button class="addTaskContentButton" @click="handleAdd">
            <span style="display: inline-flex; align-items: center; margin-top: 0.5rem">
              <md-icon>add</md-icon> Add
            </span>
          </md-filled-tonal-button>

          <md-filled-tonal-button class="removeTaskContentButton" @click="handleRemove">
            <span
              style="display: inline-flex; align-items: center; gap: 0.3rem; margin-top: 0.5rem"
            >
              <md-icon>close</md-icon> Close
            </span>
          </md-filled-tonal-button>
        </div>
      </div>
    </td>
  </tr>
</template>

<style scoped></style>
