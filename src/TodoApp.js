import { useAtom } from "jotai";
import {
  todoListAtom,
  inputAtom,
  addTodoAtom,
  removeTodoAtom,
  editTodoAtom,
  editInputAtom,
  editingTodoAtom
} from "./atoms";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Box,
  Typography,
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
  const [editingTodo, setEditingTodo] = useAtom(editingTodoAtom)

  const handleSaveTodo = (id) => {
    editTodo({ id, newText: editInput });
    if (editingTodo === id) {
      setEditingTodo(null);
      setEditInput("");
    }
  };

  const handleEditTodo = (id, text) => {
    setEditingTodo(id);
    setEditInput(text);
  };

  const handleAddTodo = () => {
    if (input.trim() !== "") {
      addTodo(input.trim()); // remove whitespaces before and after
      setInput(""); // reset the input 
    }
  };

  const handleRemoveTodo = (id) => {
    removeTodo(id);
  };

  //TODO: improve readability
  const handleCheckTodo = (id) => {
    if (editingTodo === id) return; // prevent clicking check when editing 
    setTodoList((prevTodoList) =>
      prevTodoList.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleEditKeyPress = (e, todoId) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission by default
      handleSaveTodo(todoId); // call the handle save
    }
  };

  const handleOnDragEndNonCompleted = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    const sortedList = Array.from(todoList.filter((todo) => !todo.completed));
    // create a copy of sortedList without the grabbed item
    const [reorderedItem] = sortedList.splice(source.index, 1)


    sortedList.splice(destination.index, 0, reorderedItem);
    const newTodoList = [
      ...sortedList,
      ...todoList.filter((todo) => todo.completed),
    ];
    setTodoList(newTodoList);
  };

  const handleOnDragEndCompleted = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    const sortedList = Array.from(todoList.filter((todo) => todo.completed));
    const [reorderedItem] = sortedList.splice(source.index, 1);
    sortedList.splice(destination.index, 0, reorderedItem);
    const newTodoList = [
      ...todoList.filter((todo) => !todo.completed),
      ...sortedList,
    ];
    setTodoList(newTodoList);
  };

  const nonCompletedTodos = todoList.filter((todo) => !todo.completed);
  const completedTodos = todoList.filter((todo) => todo.completed);
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h1" style={{
        margin: '30px 0 10px 0'
      }}>
        Todo List
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" >
        <TextField
          style={{
            margin: '20px 0px',
          }}
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

      <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexDirection={"row"}>
        <Box>
          <DragDropContext onDragEnd={handleOnDragEndNonCompleted}>
            <Typography variant="h2" style={{
              margin: '0 10px 0 10px',
            }}> Todo </Typography>
            <Droppable droppableId="nonCompletedTodos">
              {(provided) => (
                <List
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="list"
                >
                  {nonCompletedTodos.map((todo, index) => (
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

                          <!--
                          <ListItemButton
                            role={undefined}
                            onClick={() => handleCheckTodo(todo.id)}
                            style={
                              todo.completed && editingTodo !== todo.id
                                ? { backgroundColor: "#99a8bb", borderRadius: "15px" }
                                : { backgroundColor: "lightblue", borderRadius: "15px" }
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
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleEditTodo(todo.id, todo.text);
                                }}
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
        <Box>
          <DragDropContext onDragEnd={handleOnDragEndCompleted}>
            <Typography variant="h2" style={{
              margin: '0 10px 0 10px'
            }}> Done </Typography>
            <Droppable droppableId="completedTodos">
              {(provided) => (
                <List
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="list"
                >
                  {completedTodos.map((todo, index) => (
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
                          <ListItemButton
                            role={undefined}
                            onClick={() => handleCheckTodo(todo.id)}
                            style={
                              todo.completed

                                ? { backgroundColor: "#99a8bb", borderRadius: "15px" }
                                : { backgroundColor: "lightblue", borderRadius: "15px" }
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
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleEditTodo(todo.id, todo.text);
                                }}
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
        </Box >
      </Box >
    </Box >
  );
};

export default TodoApp;
