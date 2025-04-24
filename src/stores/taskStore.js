import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { toRaw } from 'vue'

import { useToast } from 'vue-toastification'
const toast = useToast()

export const useTaskStore = defineStore(
  'task',
  () => {
    const addIsClicked = ref(false)

    const infoIsClicked = ref(false)
    const infoIsClickedId = ref(null) //id of the task whose info is to be shown

    const editIsClicked = ref(false)
    const editIsClickedId = ref(null) //id of the task whose info is to be shown

    const searchQuery = ref('')

    const durationSortBy = ref('none') //values should cycle through none, ascending, descending
    const prioritySortBy = ref('none') //values should cycle through none, ascending, descending

    const isDarkMode = ref(false)

    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value
    }

    const tasks = ref([
      // was thinking instead of using getGroupedTasks getter, if it would be better to directly have the data stored in a way where similar modules are combined.
      // but instead of that, this structure is better for implementing search & sorting functionality for tasks.
      // because other way it would be tough to flatten the data and then search or sort it.

      {
        id: 1,
        module: 'asd',
        content:
          'orange long data !lorem ipsum dolor sit amet orange long data !lorem ipsum dolor sit amet orange long data !lorem ipsum dolor sit amet orange long data !lorem ipsum dolor sit amet orange long data !lorem ipsum dolor sit amet orange long data !lorem ipsum dolor sit amet orange long data !lorem ipsum dolor sit amet orange long data !lorem ipsum dolor sit amet orange long data !lorem ipsum dolor sit amet orange long data !lorem ipsum dolor sit amet orange long data !lorem ipsum dolor sit amet orange long data !lorem ipsum dolor sit amet',
        duration: 1,
        priority: 'Low',
        status: 'Pending',
        createdTime: '1744173979841',
        modifiedTime: '',
        completedTime: '',
      },
      {
        id: 4,
        module: 'bcd',
        content: 'just',
        duration: 5,
        priority: 'High',
        status: 'Pending',
        createdTime: '1744173979841',
        modifiedTime: '',
        completedTime: '',
      },
      {
        id: 3,
        module: 'bcd',
        content: 'hello',
        duration: 3,
        priority: 'High',
        status: 'Pending',
        createdTime: '1744173979841',
        modifiedTime: '',
        completedTime: '',
      },
      {
        id: 5,
        module: 'bcd',
        content: 'world',
        duration: 4,
        priority: 'Low',
        status: 'Completed',
        createdTime: '1744173979841',
        modifiedTime: '',
        completedTime: '1744173979841',
      },
      {
        id: 2,
        module: 'asd',
        content: 'grapes',
        duration: 2,
        priority: 'Medium',
        status: 'Completed',
        createdTime: '1744173979841',
        modifiedTime: '',
        completedTime: '1744173979841',
      },
      {
        id: 6,
        module: 'xyz',
        content: 'test',
        duration: 55,
        priority: 'Medium',
        status: 'Pending',
        createdTime: '1744173979841',
        modifiedTime: '',
        completedTime: '',
      },
      {
        id: 10,
        module: 'xyz',
        content: 'test5',
        duration: 20,
        priority: 'High',
        status: 'Completed',
        createdTime: '1744173979841',
        modifiedTime: '',
        completedTime: '1744173979841',
      },
      {
        id: 7,
        module: 'xyz',
        content: 'test2',
        duration: 5,
        priority: 'Medium',
        status: 'Completed',
        createdTime: '1744173979841',
        modifiedTime: '',
        completedTime: '1744173979841',
      },
      {
        id: 9,
        module: 'xyz',
        content: 'test4',
        duration: 10,
        priority: 'High',
        status: 'Pending',
        createdTime: '1744173979841',
        modifiedTime: '',
        completedTime: '',
      },
      {
        id: 8,
        module: 'xyz',
        content: 'test3',
        duration: 12,
        priority: 'Low',
        status: 'Pending',
        createdTime: '1744173979841',
        modifiedTime: '',
        completedTime: '',
      },
    ])

    //getters

    function getPendingTasks(ref_tasks) {
      let pendingTasks = {}

      console.log('ref_tasks arg of getPendingTasks', ref_tasks)
      console.log('ref_tasks.value arg of getPendingTasks', ref_tasks.value)

      ref_tasks.value.forEach((task) => {
        //pushing Pending tasks directly to the pendingTasks
        //will push the completed tasks in separate array. will repush those completed tasks into the groupedTasks at last
        //this will ensure the completed tasks are always at the end

        if (task.status === 'Pending') {
          //create a separate array for each module if it doesnt exist already
          if (!pendingTasks[task.module]) {
            pendingTasks[task.module] = []
          }
          pendingTasks[task.module].push(task)
        }
      })

      //done to remove empty arrays from the pendingTasks
      //to maintain order of pending tasks before completed Tasks when both are merged
      Object.entries(pendingTasks).forEach(([moduleName, tasksList]) => {
        //if tasksList is empty for a specific module, remove that moduleName from the pending tasks array
        if (tasksList.length === 0) {
          delete pendingTasks[moduleName]
        }
      })

      return pendingTasks
    }

    function getCompletedTasks(ref_tasks) {
      let completedTasks = {}
      ref_tasks.value.forEach((task) => {
        if (task.status === 'Completed') {
          //create a separate array for each module if it doesnt exist already
          if (!completedTasks[task.module]) {
            completedTasks[task.module] = []
          }
          completedTasks[task.module].push(task)
        }
      })
      return completedTasks
    }

    const getgroupedTasks = computed(() => {
      //passing the actual tasks array of objects defined in the task store.
      let pendingTasks = getPendingTasks(tasks)
      console.log('tasks from getgroupedTasks after getPendingTasks', tasks)
      let completedTasks = getCompletedTasks(tasks)

      console.log(pendingTasks)
      console.log(completedTasks)

      //check from here
      Object.entries(completedTasks).forEach(([moduleName, tasksList]) => {
        //if single arg module,
        //module[0] gives moduleName
        //module[1] gives array of tasks
        //   console.log(module_with_alltasks[0])
        //   console.log(module_with_alltasks[1])

        // console.log("test",pendingTasks[module_with_alltasks[0]]);
        //if all the tasks are completed, the grouped tasks will be empty for that specific module name
        // we will delete the empty array and then it will be recreated at the last when the below condition is checked if the module already exist or not

        if (pendingTasks[moduleName]) {
          //module has completed tasks,completed tasks appended at last
          pendingTasks[moduleName] = pendingTasks[moduleName].concat(tasksList)
        }
        // there are no pending tasks for that specific module,
        else {
          pendingTasks[moduleName] = []
          pendingTasks[moduleName] = pendingTasks[moduleName].concat(tasksList)
        }

        // check order
        // if using pendingTasks[module[0]]=completedTasks[module[0]].concat(pendingTasks[module[0]])
        //completed will appear before the pending ones

        //this has pending tasks first and then the completed ones
        // pendingTasks[moduleName]=pendingTasks[moduleName].concat(completedTasks[moduleName])
      })

      //this contains pending tasks followed by completed tasks
      return pendingTasks
    })

    const processedTasks = computed(() => {
      console.log('getgrouped tasks.value', tasks.value)
      console.log('getgrouped tasks', tasks)

      let tasksDisplay = getgroupedTasks.value

      if (searchQuery.value.trim()) {
        // console.log("filter runs");
        tasksDisplay = searchTasks(tasksDisplay, searchQuery.value.trim())
      }
      console.log('tasksDisplay after search before sort', tasksDisplay)

      if (prioritySortBy.value !== 'none' || durationSortBy.value !== 'none') {
        tasksDisplay = handleSort(tasksDisplay) //sortBy can directly be accessed by the handleSort function
      }

      return tasksDisplay
    })

    // computed doesnt take parameters
    //when we are calling getTaskbyId(some_id) we are using it as a function, no point to making it computed
    const getTaskbyId = (id) => tasks.value.find((task) => task.id === id)

    // search functionality
    // passing tasks_content , as when I have multiple things, like Search + sorting, I will be able to call this function with context of data
    function searchTasks(tasks_content, val) {
      const searchedTasks = {}
      // if tasks_content won't have been passed, we can use getgroupedTasks directly
      // const groupedTasks = getgroupedTasks.value;

      Object.entries(tasks_content).forEach(([moduleName, moduleTasks]) => {
        if (moduleName.toLowerCase().includes(val.toLowerCase())) {
          //all tasks under that module are pushed to searchedTasks
          searchedTasks[moduleName] = moduleTasks
        } else {
          let present_tasks = []
          for (let i = 0; i < moduleTasks.length; i++) {
            const task = moduleTasks[i].content
            if (task.toLowerCase().includes(val.toLowerCase())) {
              present_tasks.push(moduleTasks[i])
            }
          }
          if (present_tasks.length > 0) {
            searchedTasks[moduleName] = present_tasks
          }
        }
      })

      //add logic for adding tasks content that arent present yet.

      return searchedTasks
    }

    //updating values for how to sort
    function updateSortBy(fieldName) {
      if (fieldName === 'duration') {
        if (prioritySortBy.value !== 'none') {
          prioritySortBy.value = 'none'
        }

        if (durationSortBy.value === 'none') {
          durationSortBy.value = 'ascending'
        } else if (durationSortBy.value === 'ascending') {
          durationSortBy.value = 'descending'
        } else if (durationSortBy.value === 'descending') {
          durationSortBy.value = 'none'
        }
      } else if (fieldName === 'priority') {
        if (durationSortBy.value !== 'none') {
          durationSortBy.value = 'none'
        }

        if (prioritySortBy.value === 'none') {
          prioritySortBy.value = 'ascending'
        } else if (prioritySortBy.value === 'ascending') {
          prioritySortBy.value = 'descending'
        } else if (prioritySortBy.value === 'descending') {
          prioritySortBy.value = 'none'
        }
      }
    }

    //sorting helper function
    //current implementation has tasksDisplay in the format : {asd: Array(2), bcd: Array(3), xyz: Array(1)}
    //but the getPendingTasks has been written for data of the following format inside a ref(i.e. function internally uses .value):  {0: {entire_object}, 1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}}

    //handleSort(tasksDisplay) is called in the processedTasks if filter is applied.

    function handleSort(tasks_content) {
      let sortedTasks = {}

      Object.entries(tasks_content).forEach(([moduleName, moduleTasks]) => {
        console.log('tasks globalvariable', tasks.value)
        console.log('moduleName', moduleName)
        console.log('moduleTasks before getPendingTasks is called', moduleTasks)

        const rawTasksArray = moduleTasks.map((task) => toRaw(task))
        const moduleObj = ref(rawTasksArray)

        console.log('moduleObj', moduleObj)

        //want to always make sure that pending entries are before the completed entries - even in the case of sorted data
        let pendingTasksObj = getPendingTasks(moduleObj)
        console.log('pendingTasks from handleSort', pendingTasksObj)
        let completedTasksObj = getCompletedTasks(moduleObj)
        console.log('completedTasks from handleSort', completedTasksObj)

        // Convert pendingTasksObj and completedTasksObj to arrays
        const pendingTasks = Object.values(pendingTasksObj).flat()
        const completedTasks = Object.values(completedTasksObj).flat()

        // Sort the pending and completed tasks
        //giving the sortData() arg as object of format {module: arrayoftasks}
        //sortData returns an object itself, although all the tasks in the object are for this single module
        //but we take out all the tasks of that specific module by using [moduleName] at last in sortData(..)[moduleName]
        //sortedPendingTasks now becomes an array and can be iterated using spread operator as done below
        const sortedPendingTasks = sortData({ [moduleName]: pendingTasks })[moduleName]
        const sortedCompletedTasks = sortData({ [moduleName]: completedTasks })[moduleName]

        // Combine sorted pending and completed tasks
        sortedTasks[moduleName] = [...sortedPendingTasks, ...sortedCompletedTasks]
      })

      //preserves order of pending and completed tasks even when sorted
      //sorts pending tasks and completed tasks separately and then combines them back together, preserving order
      return sortedTasks
    }

    //sorting logic
    function sortData(tasks_content) {
      let sortedData = {}

      const priorityMap = { Low: 1, Medium: 2, High: 3 }
      // Each moduleName is iterated once
      Object.entries(tasks_content).forEach(([moduleName, moduleTasks]) => {
        // console.log("moduleName",moduleName,"moduleTasks", moduleTasks);

        const sortedModuleTasks = [...moduleTasks] //cloning in order to not making changes directly in object
        //as tasksDisplay is not a ref in ProcessedTasks , if not doing this, it doesnt change order in the table because it may see that the object remains the same(like only the order of elements changed)

        sortedModuleTasks.sort((a, b) => {
          if (durationSortBy.value !== 'none') {
            if (durationSortBy.value === 'ascending') {
              return a.duration - b.duration
            } else if (durationSortBy.value === 'descending') {
              return b.duration - a.duration
            }
          } else if (prioritySortBy.value !== 'none') {
            if (prioritySortBy.value === 'ascending') {
              return priorityMap[a.priority] - priorityMap[b.priority]
            } else if (prioritySortBy.value === 'descending') {
              return priorityMap[b.priority] - priorityMap[a.priority]
            }
          }
        })
        sortedData[moduleName] = sortedModuleTasks
        console.log('SortedData', sortedData)
      })
      return sortedData
    }

    //actions
    function addTask(task) {
      try {
        tasks.value.push(task)
        toast.success('Task added successfully')
      } catch {
        toast.error('Error adding task')
      }
    }

    function deleteTask(id) {
      // console.log('Deleting task with id' + id);
      try {
        tasks.value = tasks.value.filter((t) => t.id !== id)
        toast.success('Task deleted successfully')
      } catch {
        toast.error('Error deleting task')
      }
    }

    function updateTask(id, modified_taskData) {
      try {
        /* not the best approach -> 1. doing 2 operations delete + push, 2. not good for reactivity v-for (stable ordering & index)
          //delete task with id and push the modified object.
          //modified object was taken from the original object and then modified. thus structure of data stays same
          deleteTask(id);
          tasks.value.push(modified_taskData);*/

        // console.log(id);
        // console.log(getTaskbyId(id));
        // console.log(modified_taskData);

        const taskIndex = tasks.value.findIndex((t) => t.id === id)
        //findIndex will give -1 if that specific task is not present
        if (taskIndex !== -1) {
          tasks.value[taskIndex] = modified_taskData.value //replacing the object at that specific index in array
        }

        toast.success('Task updated successfully')
      } catch {
        toast.error('Error updating task')
      }
    }

    /* replaced by updateViaModuleCheckbox. keeping the logic simple 
    //function to update status while toggling checkboxes
    function toggleStatus(id){
        const taskIdx = tasks.value.findIndex(t => t.id === id);
        if(taskIdx!==-1){
            if(tasks.value[taskIdx].status === 'Completed'){
                tasks.value[taskIdx].status = 'Pending';
                tasks.value[taskIdx].completedTime = '';//resetting the completed time to empty string
            } 
            else if(tasks.value[taskIdx].status === 'Pending'){
                tasks.value[taskIdx].status = 'Completed';
                tasks.value[taskIdx].completedTime = Date.now();
            }
        }
        // console.log("data updated");
    }
*/

    // function to handle module checkbox
    function updateViaModuleCheckbox(task_id, updatedModulevalue) {
      const taskidx = tasks.value.findIndex((t) => t.id === task_id)
      if (taskidx !== -1) {
        if (updatedModulevalue === true) {
          //completing task
          if (tasks.value[taskidx].status === 'Pending') {
            tasks.value[taskidx].status = 'Completed'
            tasks.value[taskidx].completedTime = Date.now()
          }
        } else if (updatedModulevalue === false) {
          if (tasks.value[taskidx].status === 'Completed') {
            tasks.value[taskidx].status = 'Pending'
            tasks.value[taskidx].completedTime = ''
          }
        }
      }
    }

    //remove exposed vars and funcs which are not required
    //getPendingTasks, getCompletedTasks,searchTasks not returned
    return {
      addIsClicked,
      prioritySortBy,
      durationSortBy,
      infoIsClicked,
      infoIsClickedId,
      editIsClicked,
      editIsClickedId,
      tasks,
      searchQuery,
      processedTasks,
      getgroupedTasks,
      updateSortBy,
      getTaskbyId,
      addTask,
      deleteTask,
      updateTask,
      updateViaModuleCheckbox,
      isDarkMode,
      toggleDarkMode,
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'taskStore', //under what name will the data be stored
          //if key is not specified, default is the name of the store

          storage: localStorage, //alternative is sessionStorage

          //paths contains what is to be stored
          paths: ['tasks', 'searchQuery', 'prioritySortBy', 'durationSortBy', 'isDarkMode'],
        },
      ],
    },
  },
)
