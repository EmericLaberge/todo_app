import React from "react";
import { useAtom } from "jotai";
import {
  todoListAtom,
  inputAtom,
  addTodoAtom,
  removeTodoAtom,
  checkTodoAtom,
} from "./atoms";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Box,
  Typography,
  Divider,
  Fab,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import "./TodoApp.css";
import { Add } from "@mui/icons-material";

const TodoApp = () => {
  const [todoList, setTodoList] = useAtom(todoListAtom);
  const [input, setInput] = useAtom(inputAtom);
  const [, addTodo] = useAtom(addTodoAtom);
  const [, removeTodo] = useAtom(removeTodoAtom);
  const [checked, setChecked] = useAtom(checkTodoAtom);

  const handleAddTodo = () => {
    if (input.trim() !== "") {
      addTodo(input.trim());
      setInput("");
    }
  };

  const handleRemoveTodo = (id) => {
    removeTodo(id);
  };

  const handleCheckTodo = (id) => {
    setChecked(id);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <TextField
        className="input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="New Todo..."
      />
      <Fab aria-label="add" color="primary" onClick={handleAddTodo}>
        <AddIcon />
      </Fab>
      <List className="list">
        {todoList
          .sort((a, b) => a.completed - b.completed)
          .map((todo) => (
            <ListItem
              key={todo.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleRemoveTodo(todo.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemButton
                role={undefined}
                onClick={() => handleCheckTodo(todo.id)}
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={todo.completed} // make sure the checkbox is checked if the todo is completed
                    disableRipple
                    onClick={() => handleCheckTodo(todo.id)}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={todo.text}
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

export default TodoApp;
