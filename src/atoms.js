import { atom } from "jotai";

export const todoListAtom = atom([]);
export const todoIndexAtom = atom(0);
export const inputAtom = atom("");
export const editInputAtom = atom("");
export const addTodoAtom = atom(null, (get, set, newTodoItem) => {
  const todoList = get(todoListAtom);
  const todoIndex = get(todoIndexAtom);
  const newTodo = { id: todoIndex, text: newTodoItem, completed: false };
  set(todoListAtom, [newTodo, ...todoList]);
  set(todoIndexAtom, todoIndex + 1);
});
export const removeTodoAtom = atom(null, (get, set, id) => {
  const todoList = get(todoListAtom);
  const filteredTodo = todoList.filter((todo) => todo.id !== id);
  set(todoListAtom, filteredTodo);
});
export const editTodoAtom = atom(null, (get, set, { id, newText }) => {
  const todoList = get(todoListAtom);
  const todoIndex = todoList.findIndex((todo) => todo.id === id);
  if (todoIndex === -1) return;
  const updatedTodo = { ...todoList[todoIndex], text: newText };
  const updatedTodoList = [...todoList];
  updatedTodoList[todoIndex] = updatedTodo;
  set(todoListAtom, updatedTodoList);
});
