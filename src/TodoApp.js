import { useAtom } from "jotai";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
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
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";

import {
  todoListAtom,
  inputAtom,
  addTodoAtom,
  removeTodoAtom,
  editTodoAtom,
  editInputAtom,
  editingTodoAtom,
} from "./atoms";

import "./TodoApp.css";
import { lightGreen } from "@mui/material/colors";

const TodoApp = () => {
  // Array of todo objects
  const [todoList, setTodoList] = useAtom(todoListAtom);

  // String to hold the input value of the new todo
  const [input, setInput] = useAtom(inputAtom);

  // Functions to update the todoList with a new object containing
  // input as the text and a unique id and completed as false
  const [, addTodo] = useAtom(addTodoAtom);

  // Function to remove a todo object from the todoList
  const [, removeTodo] = useAtom(removeTodoAtom);

  // Function to edit the text of a todo object
  const [, editTodo] = useAtom(editTodoAtom);

  // function to hold and update the text of the todo being edited
  const [editInput, setEditInput] = useAtom(editInputAtom);

  // function to hold and update the id of the todo being edited
  const [editingTodo, setEditingTodo] = useAtom(editingTodoAtom);

  const remainingTodos = todoList.filter((todo) => !todo.completed);
  const completedTodos = todoList.filter((todo) => todo.completed);

  // Function to handle adding a todo
  const handleAddTodo = () => {
    if (input.trim() !== "") {
      // check if the input is not empty
      addTodo(input.trim()); // remove whitespaces before and after the input
      setInput(""); // reset the input
    }
  };

  // Function to handle removing a todo
  const handleRemoveTodo = (id) => {
    removeTodo(id);
  };

  const handleCheckTodo = (id) => {
    const isEditing = editingTodo === id;
    if (isEditing) return; // prevent clicking check when editing

    setTodoList((prevTodoList) => {
      const updatedTodoList = prevTodoList.map((todo) => {
        //  flip the completed value if the id matches and return the todo
        // else return the todo
        if (todo.id === id) {
          // flip the completed value if the id matches
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
      return updatedTodoList;
    });
  };

  // Function to handle editing a todo
  const handleEditTodo = (id, text) => {
    setEditingTodo(id);
    setEditInput(text);
  };

  // Function to handle saving an edited todo
  const handleSaveEditedTodo = (id) => {
    editTodo({ id, newText: editInput });
    if (editingTodo === id) {
      setEditingTodo(null);
      setEditInput("");
    }
  };
  const handleEditKeyPress = (e, todoId) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission by default
      handleSaveEditedTodo(todoId); // call the handle save
    }
  };

  const handleOnDragEndNonCompleted = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }

    // Filter the todoList to get only the non completed todos array
    const remainingTodos = todoList.filter((todo) => !todo.completed);
    const completedTodos = todoList.filter((todo) => todo.completed);
    // create a copy of sortedList without the grabbed item
    const draggedItem = remainingTodos.splice(source.index, 1)[0];

    // insert the dragged item at the destination index
    remainingTodos.splice(destination.index, 0, draggedItem);
    const newTodoList = [...remainingTodos, ...completedTodos];
    setTodoList(newTodoList);
  };

  const handleOnDragEndCompleted = (result) => {
    const { source, destination } = result;
    // If there is no valid destination, return
    if (!destination) {
      return;
    }

    const remainingTodos = todoList.filter((todo) => !todo.completed);
    // Filter the todoList to get the array of completed todos
    const completedTodos = todoList.filter((todo) => todo.completed);

    // Extract the reordered item from the completedTodos
    const draggedItem = completedTodos.splice(source.index, 1)[0];

    // Insert the reordered item at the destination index
    completedTodos.splice(destination.index, 0, draggedItem);

    // Create a new array by combining the non-completed todos with the sorted completed todos
    const newTodoList = [...remainingTodos, ...completedTodos];

    // Update the state with the newTodoList
    setTodoList(newTodoList);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" flexDirection="column" justifyContent={"center"}>
        {/* Todo list title */}
        <Typography
          variant="h1"
          style={{
            margin: "30px 0 10px 0",
            textAlign: "center",
          }}
        >
          To Do List
        </Typography>

        {/* Box to hold the input field and add button */}
        <Box display="flex" justifyContent="center">
          <TextField
            style={{
              margin: "20px 0px",
              width: "50%",
              backgroundColor: "#C8E6C9",
            }}
            value={input} // set the value of the input text to the input state
            // update the input value when the user types
            onChange={(e) => setInput(e.target.value)}
            // add a todo when the user presses enter
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddTodo();
              }
            }}
            placeholder="New To Do ..." // placeholder text
          />
          {/* Add button that calls the handleAddTodo function when clicked */}
          <IconButton
            aria-label="add"
            color="primary"
            variant="contained"
            onClick={handleAddTodo}
          >
            <AddIcon />
          </IconButton>
        </Box>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="flex-start"
          textAlign={"center"}
          flexDirection={"row"}
          flexWrap={"wrap"}
        >
          <Box flex={1} alignItems="center">
            {" "}
            {/* add flex: 1 to center the list */}
            <DragDropContext onDragEnd={handleOnDragEndNonCompleted}>
              <Typography
                variant="h2"
                style={{
                  margin: "0 10px 0 10px",
                }}
              >
                Pending
              </Typography>
              <Droppable droppableId="nonCompletedTodos">
                {(provided) => (
                  <List
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="list"
                    style={{ alignContent: "center" }}
                  >
                    {remainingTodos.map((todo, index) => (
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
                            {/* ListItemButton makes each todoItem clickable  */}
                            <ListItemButton
                              role={undefined}
                              onClick={() => handleCheckTodo(todo.id)}
                              style={
                                todo.completed && editingTodo !== todo.id
                                  ? {
                                    backgroundColor: "#99a8bb",
                                    borderRadius: "15px",
                                  }
                                  : {
                                    backgroundColor: "lightblue",
                                    borderRadius: "15px",
                                  }
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
                                  style={{
                                    width: "100%",
                                  }}
                                  value={editInput}
                                  onChange={(e) => setEditInput(e.target.value)}
                                  onKeyPress={(e) =>
                                    handleEditKeyPress(e, todo.id)
                                  }
                                />
                              ) : (
                                <ListItemText
                                  primary={todo.text}
                                  style={{
                                    textDecoration: todo.completed
                                      ? "line-through"
                                      : "none",
                                    fontSize: "20px",
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
                                  onClick={() => handleSaveEditedTodo(todo.id)}
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
          <Box flex={1}>
            {" "}
            {/* add flex: 1 to center the list */}
            <DragDropContext onDragEnd={handleOnDragEndCompleted}>
              <Typography
                variant="h2"
                style={{
                  margin: "0 10px 0 10px",
                }}
              >
                Done
              </Typography>
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
                                  ? {
                                    backgroundColor: "#99a8bb",
                                    borderRadius: "15px",
                                  }
                                  : {
                                    backgroundColor: "lightblue",
                                    borderRadius: "15px",
                                  }
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
                                  style={{
                                    width: "100%",
                                  }}
                                  value={editInput}
                                  onChange={(e) => setEditInput(e.target.value)}
                                  onKeyPress={(e) =>
                                    handleEditKeyPress(e, todo.id)
                                  }
                                />
                              ) : (
                                // change the text decoration to line-through if the todo is completed
                                <ListItemText
                                  primary={todo.text}
                                  style={{
                                    textDecoration: todo.completed
                                      ? "line-through"
                                      : "none",
                                  }}
                                />
                              )}

                              {/* edit Todo button  */}
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

                              {/* remove Todo button  */}
                              {editingTodo !== todo.id && (
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() => handleRemoveTodo(todo.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              )}

                              {/* save Todo button  */}
                              {editingTodo === todo.id && (
                                <IconButton
                                  edge="end"
                                  aria-label="save"
                                  onClick={() => handleSaveEditedTodo(todo.id)}
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
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default TodoApp;
