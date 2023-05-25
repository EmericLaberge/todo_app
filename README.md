# To-Do List Application

This application is a To-Do list with a simple, user-friendly UI, which allows you to manage your tasks effectively. 

## Features

1. Add new tasks.
2. Edit existing tasks.
3. Delete tasks.
4. Mark tasks as complete.
5. Reorder tasks by dragging and dropping them inside their respective lists.

## Technology

This application is built using React, and uses the `jotai` state management library to handle application state.

I also used the [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd) library to implement drag and drop functionality.

## How to Install and Run the Application

**This application is hosted on GitHub Pages, and can be accessed
[here](https://emericlaberge.github.io/todo_app/).**

If you want to run the application locally, follow these steps:

1. Clone the repository to your local machine.
2. Navigate into the repository's directory.
3. Install the dependencies using `npm install`.
4. Start the application using `npm start`.

## State Management

The application uses [jotai](https://jotai.org) for atomic state management. Here is a brief explanation of each atom used:

1. `todoListAtom`: An atom that keeps track of all the tasks.
2. `todoIndexAtom`: An atom that keeps track of the next index for new tasks.
3. `editingTodoAtom`: An atom that keeps track of the task currently being edited.
4. `inputAtom` and `editInputAtom`: Atoms that handle the user's input when adding a new task and editing an existing task.
5. `nonCompletedTodoListAtom` and `completedTodoListAtom`: Atoms that filter tasks based on whether they're completed or not.
6. `addTodoAtom`: An atom that adds new tasks to the task list.
7. `removeTodoAtom`: An atom that removes tasks from the task list.
8. `editTodoAtom`: An atom that updates the text of an existing task.
9. `toggleTodoAtom`: An atom that toggles the completion status of a task.

Please refer to the code and comments for a deeper understanding of how each part of the application works.
