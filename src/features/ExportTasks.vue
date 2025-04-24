<script setup>
import { useTaskStore } from '@/stores/taskStore'
const taskStore = useTaskStore()

const handleExport = (data, filename = 'tasksList.csv') => {
  if (!data || !data.length) return

  const csvHeaders = Object.keys(data[0]).join(',') + '\n'
  const csvRows = data.map((row) => Object.values(row).join(',')).join('\n')
  const csvContent = csvHeaders + csvRows

  //Blob is binary large object, represents immutable raw data or simply a file in memory.
  //Can hold text, binary data, images...
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

  const url = URL.createObjectURL(blob) //creates a temp url pointing to the blob

  const link = document.createElement('a') //create anchor element
  link.setAttribute('href', url) //set the href attribute = url pointing to the blob
  link.setAttribute('download', filename) //set download attribute to filename as above

  document.body.appendChild(link) //add the anchor element to the DOM temporarily
  link.click() //click it
  document.body.removeChild(link) //remove it from the DOM
}
</script>

<template>
  <md-filled-tonal-button @click="() => handleExport(taskStore.tasks)">
    Export Tasks to CSV
  </md-filled-tonal-button>
</template>

<style scoped></style>
