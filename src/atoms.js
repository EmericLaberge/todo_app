import { atom } from "jotai";


export const todoListAtom = atom([]);
export const todoIndexAtom = atom(0);
export const inputAtom = atom('');

// TODO: Define addTodoAtom to add a new todo to the list
export const addTodoAtom = atom(
  null,
  (get, set, newTodoItem) => {
    const todoList = get(todoListAtom); 
    const todoIndex = get(todoIndexAtom);
    const newTodo = { id: todoIndex , text: newTodoItem};
    set(todoListAtom, [...todoList, newTodo]);
    set(todoIndexAtom,todoIndex + 1);
  }
)

// TODO: Define removeTodoAtom to remove a todo from the list based on its id
export const removeTodoAtom = atom(
  null,
  (get, set, key) => {
    const todoList = get(todoListAtom);
    const fileredTodo = todoList.filter(object => {
      return object.id !== key;
    });
      set(todoListAtom,fileredTodo);
  }
)
// TODO: Define editTodoAtom to update the text of a todo item
export const editTodoAtom = atom(
  null,
  (get, set, { id, newText }) => {
    const todoList = get(todoListAtom);
    const updatedTodoList = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, text: newText };
      }
      return todo;
    });
    set(todoListAtom, updatedTodoList);
  }
);
