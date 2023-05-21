import { atom } from "jotai";

export const todoListAtom = atom([]);
export const todoIndexAtom = atom(0);
export const todoCompletedListAtom = atom([]);
export const inputAtom = atom("");

export const addTodoAtom = atom(null, (get, set, newTodoItem) => {
  const todoList = get(todoListAtom);
  const todoIndex = get(todoIndexAtom);

  const newTodo = { id: todoIndex, text: newTodoItem, completed: false };
  set(todoListAtom, [...todoList, newTodo]);
  set(todoIndexAtom, todoIndex + 1);
});

export const removeTodoAtom = atom(null, (get, set, id) => {
  const todoList = get(todoListAtom);

  const filteredTodo = todoList.filter((todo) => {
    return todo.id !== id;
  });

  set(todoListAtom, filteredTodo);
});
export const checkTodoAtom = atom(null, (get, set, todoId) => {
  const todoList = get(todoListAtom);
  // Find the todo that needs to be checked
  const todoIndex = todoList.findIndex((todo) => todo.id === todoId);
  if (todoIndex === -1) return;
  // Clone the todo, toggle its completed state
  const updatedTodo = {
    ...todoList[todoIndex],
    completed: !todoList[todoIndex].completed,
  };
  const updatedTodoList = [...todoList];
  updatedTodoList[todoIndex] = updatedTodo;
  set(todoListAtom, updatedTodoList);
});
