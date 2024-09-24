# To-Do List App

## Introduction

This To-Do List app is a comprehensive task management tool that allows users to create, edit, delete, and manage tasks efficiently. The app also supports setting due dates, times, priorities, comments for completed tasks, and a dark mode for a better user experience.

## Features

1. **Add Task**: Users can add tasks with a due date, time, and priority.
2. **Edit Task**: Tasks can be edited to update their details.
3. **Delete Task**: Tasks can be removed from the list.
4. **Mark as Done**: Users can mark tasks as completed.
5. **Comments on Completion**: Add comments to completed tasks.
6. **Dark Mode**: Toggle between light and dark themes.
7. **Responsive Design**: The app is fully responsive and works on various screen sizes.
8. **Local Storage**: Tasks and preferences are saved in the browser's local storage.

## Usage

- **Add Task**: Enter task details in the input fields and click "Add".
- **Edit Task**: Double-click on a task to edit it.
- **Delete Task**: Click the '×' icon next to a task to delete it.
- **Mark as Done**: Click on a task to mark it as completed.
- **Dark Mode**: Use the toggle switch to enable or disable dark mode.

## Files

- `index.html`: The main HTML file containing the structure of the app.
- `style.css`: The CSS file for styling the app.
- `script.js`: The JavaScript file containing the logic of the app.

## Changes Made

### HTML (index.html)

- Added a dark mode toggle switch.
- Included new input fields for due date and due time.
- Added a hidden input to store the index of the task being edited.

### CSS (style.css)

- Defined styles for dark mode.
- Updated styles to make the app responsive.
- Added styles for new input fields and buttons.
- Adjusted styles for task items to include due date, time, and priority.

### JavaScript (script.js)

- **Dark Mode**:
  - Added event listener for dark mode toggle.
  - Updated `loadTasks` and `updateStorage` functions to handle dark mode.
  - Toggled dark mode styles based on user preference.

- **Task Management**:
  - Modified `addTask` function to include due date, time, priority, and comment.
  - Enhanced `edit` and `save` functions to handle task details.
  - Updated `updateStorage` to store all task details in local storage.

- **Responsive Design**:
  - Ensured that the app layout adjusts for various screen sizes.

### Functions Added/Modified

- **addTask(task, date, time, priority, done, comment)**: Adds a task to the list.
- **edit(index)**: Populates the input fields with the task details for editing.
- **save()**: Saves the edited task details.
- **loadTasks()**: Loads tasks from local storage and applies dark mode if enabled.
- **updateStorage()**: Updates local storage with the current tasks and dark mode preference.
