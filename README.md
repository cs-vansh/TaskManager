# Task Manager
A simple task manager built with Vue 3, using Pinia for state management and Local Storage for persistence.

## Features

- **Add New Tasks** with:
  - Module Name (Text)
  - Contents (Multi-line Text)
  - Duration (Number - Days)
  - Priority (Low / Medium / High)
  - Status (Pending / Completed)
- **Display Tasks** in a clean, responsive table:
  - Columns: Module | Contents | Duration | Priority | Status | Actions
- **Edit Tasks** (via Modal)
- **Delete Tasks**
- **Mark Tasks as Complete** (Completed tasks move to the bottom)
- **Sort Tasks**: Sorting has been implemented separately for Pending and Completed Tasks. 
  - By Priority
  - By Duration
- **Search/Filter Tasks** by Module Name or Contents
- **Form Validation** to ensure input correctness
- **Task History Log**:
  - Capture Created / Updated / Completed timestamps
- **Local Storage** Persistence
  - Abstracted through a service layer (repository pattern)
- **State Management** using **Pinia**
- **Material Design 3 UI**
- **Responsive Design** for mobile, tablet, and desktop

## 🌟 Bonus Features

- **Dark Mode Toggle** (Pinia-managed)
- **Export Tasks to CSV**


# TO DO's
- Import Bulk tasks from CSV
- Connect with a DB
- Generalize the logic for all modals into 1 modal component. (can also use Modal for adding tasks)
- Drag and Drop functionality
