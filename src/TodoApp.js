import React, { useState } from "react";
import { useAtom } from "jotai";
import {
  todoListAtom,
  inputAtom,
  addTodoAtom,
  removeTodoAtom,
  editTodoAtom,
  editInputAtom,
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
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "./TodoApp.css";

const TodoApp = () => {
  const [todoList, setTodoList] = useAtom(todoListAtom);
  const [input, setInput] = useAtom(inputAtom);
  const [, addTodo] = useAtom(addTodoAtom);
  const [, removeTodo] = useAtom(removeTodoAtom);
  const [, editTodo] = useAtom(editTodoAtom);
  const [editInput, setEditInput] = useAtom(editInputAtom);
  const [editingTodo, setEditingTodo] = useState(null);

  const handleSaveTodo = (id) => {
    editTodo({ id, newText: editInput });
    setEditingTodo(null);
    setEditInput("");
  };

  const handleEditTodo = (id, text) => {
    setEditingTodo(id);
    setEditInput(text);
  };

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
    if (editingTodo === id) return;
    setTodoList((prevTodoList) =>
      prevTodoList.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleEditKeyPress = (e, todoId) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      handleSaveTodo(todoId);
    }
  };

  const handleOnDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId !== destination.droppableId) {
      // dragging between two lists
      return;
    }

    if (source.droppableId === "nonCompletedTodos") {
      const items = Array.from(nonCompletedTodoList);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      setTodoList([...items, ...completedTodoList]);
    } else {
      const items = Array.from(completedTodoList);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      setTodoList([...nonCompletedTodoList, ...items]);
    }
  };

  const nonCompletedTodoList = todoList.filter((todo) => !todo.completed);
  const completedTodoList = todoList.filter((todo) => todo.completed);

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h3" textAlign={"center"}>
        Todo List
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleAddTodo();
            }
          }}
          placeholder="New Todo..."
        />
        <IconButton
          aria-label="add"
          color="primary"
          variant="contained"
          onClick={handleAddTodo}
        >
          <AddIcon />
        </IconButton>
      </Box>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Typography variant="h4">Non-completed tasks:</Typography>
        <Droppable droppableId="nonCompletedTodos">
          {(provided) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="list"
            >
              {nonCompletedTodoList.map((todo, index) => (
                <Draggable
                  key={todo.id}
                  draggableId={todo.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {/* The code for non-completed tasks */}
                      <ListItemButton
                        role={undefined}
                        onClick={() => handleCheckTodo(todo.id)}
                        style={
                          todo.completed && editingTodo !== todo.id
                            ? { backgroundColor: "#e0e0e0" }
                            : { backgroundColor: "#fff" }
                        }
                        dense
                      >
                        {editingTodo !== todo.id && (
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={todo.completed}
                              disableRipple
                            />
                          </ListItemIcon>
                        )}
                        {editingTodo === todo.id ? (
                          <TextField
                            value={editInput}
                            onChange={(e) => setEditInput(e.target.value)}
                            onKeyPress={(e) => handleEditKeyPress(e, todo.id)}
                          />
                        ) : (
                          <ListItemText
                            primary={todo.text}
                            style={{
                              textDecoration: todo.completed
                                ? "line-through"
                                : "none",
                            }}
                          />
                        )}
                        {editingTodo !== todo.id && (
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => handleEditTodo(todo.id, todo.text)}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                        {editingTodo !== todo.id && (
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleRemoveTodo(todo.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                        {editingTodo === todo.id && (
                          <IconButton
                            edge="end"
                            aria-label="save"
                            onClick={() => handleSaveTodo(todo.id)}
                          >
                            <CheckIcon />
                          </IconButton>
                        )}
                      </ListItemButton>
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
        <Typography variant="h4">Completed tasks:</Typography>
        <Droppable droppableId="completedTodos">
          {(provided) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="list"
            >
              {completedTodoList.map((todo, index) => (
                <Draggable
                  key={todo.id}
                  draggableId={todo.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {/* The code for completed tasks */}
                      <ListItemButton
                        role={undefined}
                        onClick={() => handleCheckTodo(todo.id)}
                        style={
                          todo.completed && editingTodo !== todo.id
                            ? { backgroundColor: "#e0e0e0" }
                            : { backgroundColor: "#fff" }
                        }
                        dense
                      >
                        {editingTodo !== todo.id && (
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={todo.completed}
                              disableRipple
                            />
                          </ListItemIcon>
                        )}
                        {editingTodo === todo.id ? (
                          <TextField
                            value={editInput}
                            onChange={(e) => setEditInput(e.target.value)}
                            onKeyPress={(e) => handleEditKeyPress(e, todo.id)}
                          />
                        ) : (
                          <ListItemText
                            primary={todo.text}
                            style={{
                              textDecoration: todo.completed
                                ? "line-through"
                                : "none",
                            }}
                          />
                        )}
                        {editingTodo !== todo.id && (
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => handleEditTodo(todo.id, todo.text)}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                        {editingTodo !== todo.id && (
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleRemoveTodo(todo.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                        {editingTodo === todo.id && (
                          <IconButton
                            edge="end"
                            aria-label="save"
                            onClick={() => handleSaveTodo(todo.id)}
                          >
                            <CheckIcon />
                          </IconButton>
                        )}
                      </ListItemButton>
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default TodoApp;
