import React, { useState } from 'react';
import { useAtom } from 'jotai';
import {
  todoListAtom,
  inputAtom,
  addTodoAtom,
  removeTodoAtom,
  editTodoAtom
} from './atoms';
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const TodoApp = () => {
  const [todoList, setTodoList] = useAtom(todoListAtom);
  const [input, setInput] = useAtom(inputAtom);
  const [, addTodo] = useAtom(addTodoAtom);
  const [, removeTodo] = useAtom(removeTodoAtom);
  const [, editTodo] = useAtom(editTodoAtom);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const handleAddTodo = () => {
    if (input.trim() !== '') {
      addTodo(input.trim());
      setInput('');
    }
  };

  const handleRemoveTodo = (id) => {
    removeTodo(id);
  };

  const handleEditTodo = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const handleSaveEdit = (id) => {
    if (editingText.trim() !== '') {
      editTodo({
        id,
        newText: editingText.trim()
      });
      setEditingId(null);
      setEditingText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  return (
    <div>
      <TextField
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="New Todo..."
      />
      <Button variant="contained" color="primary" onClick={handleAddTodo}>
        Add
      </Button>
      <List>
        {todoList.map((todo) => (
          <ListItem key={todo.id}>
            {editingId === todo.id ? (
              <>
                <TextField
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSaveEdit(todo.id)}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="default"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <ListItemText primary={todo.text} />
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEditTodo(todo.id, todo.text)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleRemoveTodo(todo.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TodoApp;
