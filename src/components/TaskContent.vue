<script setup>
import '@material/web/checkbox/checkbox.js'

const props = defineProps(['task'])
const emit = defineEmits(['updateTaskStatusCheckbox'])

import { computed } from 'vue'
const completed = computed({
  //get will be used to get the value
  get: () => props.task.status === 'Completed',

  //set will be used to react to changes
  set: (newval) => {
    emit('updateTaskStatusCheckbox', newval) // Pass true or false
  },
})

/*
import { ref } from 'vue';
const completed= ref(props.task.status === 'Completed' ? true : false);

import { watch } from 'vue';
watch(completed, ()=>{
    //update the task's status property in the store or parent component

    //never modify props directly - gives error 
    // props.task.status = completed.value;   

    emit('updateTaskStatusCheckbox')

    // console.log(completed.value);
    // console.log('value changed for completed var')
})
*/
const handleTaskCheckbox = () => {
  completed.value = !completed.value
  // if(completed.value === true){
  //     completed.value = false;
  // }
  // else if(completed.value === false){
  //     completed.value = true;
  // }
}
</script>

<template>
  <!-- textarea converts enter(new line) into spaces in a single line without white-space: pre;  -->
  <span
    :class="{ strikethrough: task.status === 'Completed' }"
    style="
      white-space: pre-wrap; /* want text to wrap and preserve formatting, like long descriptions.  */
    "
  >
    <md-checkbox
      :checked="task.status === 'Completed'"
      @change="handleTaskCheckbox"
      :key="task.id"
    ></md-checkbox>
    {{ task.content }}
  </span>
</template>

<style scoped></style>
