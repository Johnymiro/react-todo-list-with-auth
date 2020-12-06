import React, { useState } from "react";
import {
  Checkbox,
  Container,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  FormControlLabel,
  IconButton,
  InputBase,
  makeStyles,
  Typography,
} from "@material-ui/core";
import {
  AccessAlarm as DateIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
} from "@material-ui/icons";
import { ListGroup, ListGroupItem } from "reactstrap";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import DoneIcon from "@material-ui/icons/Done";
import CancelIcon from "@material-ui/icons/Cancel";
import CardLayout from "./CardLayout";
import firebase from "../services/firebase";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  root: {
    width: "100%",
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  expensionSummary: {
    position: "relative",
    display: "block",
  },
  todoItemFormControl: {
    width: "calc(100% - 180px)",
  },
  optionButtonArea: {
    position: "fixed",
    outline: "0 !important",
    right: 85,
    // marginTop: '6px',
  },
  optionButtons: {
    outline: "0 !important",
    margin: "auto",
  },
  dateField: {
    position: "relative",
    outline: "0 !important",
    margin: "auto",
    textAlign: "center",
    marginRight: 30,
    marginTop: 10,
    border: "1px solid #ccc",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#00000010",
    fontSize: "0.875rem",
  },
  dateIcon: {
    position: "absolute",
    top: -15,
    left: "calc(50% - 12px)",
  },
  rootButton: {
    display: "flex",
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  optionButtonPopper: {
    zIndex: 9,
  },
  filterArea: {
    marginBottom: 20,
  },
  search: {
    position: "relative",
    borderRadius: 5,
    backgroundColor: "#fff",
    boxShadow:
      "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: 300,
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  addTodoItemButton: {
    /* display: "block",
    outline: "0 !important",
    margin: "auto",
    marginTop: 5, */
  },
  addTodoItemButtonIcon: {
    color: "#67af50",
    fontSize: 50,
  },
}));

function TodoItemList(props) {
  const classes = useStyles();
  let lists = props.list.todoList;
  let filteredLists;

  const [searchText, setSearchText] = useState("");

  if (props.list.id) {
    filteredLists = props.list.todoList.filter((list) =>
      list.name.includes(searchText)
    );
  } else {
    filteredLists = [];
  }

  const twoDigitDateTextMaker = (time) => {
    let text = time.toString();
    if (text.toString().length > 1) {
      return text;
    } else {
      return "0" + text;
    }
  };

  const calculateFullDate = (time) => {
    // Return Type -> DD.MM.YY  HH:MM
    const eventDate = new Date(time);
    const resDate =
      twoDigitDateTextMaker(eventDate.getUTCDate()) +
      "." +
      twoDigitDateTextMaker(eventDate.getUTCMonth() + 1) +
      "." +
      twoDigitDateTextMaker(eventDate.getUTCFullYear());
    const resClock =
      twoDigitDateTextMaker(eventDate.getHours()) +
      ":" +
      twoDigitDateTextMaker(eventDate.getMinutes());
    return {
      date: resDate,
      clock: resClock,
    };
  };

  const editTodo = (event, list, index) => {
    event.stopPropagation();
    props.openEditDialog(list, index);
  };

  const removeTodo = (event, todo, list) => {
    event.stopPropagation();

    const newList = list.todoList.filter((item) => {
      if (item.name === todo.name) {
        return false;
      }
      return true;
    });
    firebase
      .firestore()
      .collection(props.currentUserId)
      .doc(list.id)
      .set({
        name: list.name,
        todoList: newList,
      })
      .then((e) => {
        console.log(e);
      });
  };

  const checkboxToggle = (event, todo, list) => {
    event.stopPropagation();
    const newList = list.todoList.map((item) => {
      if (item.name === todo.name) {
        return { ...todo, isComplete: !todo.isComplete };
      }
      return item;
    });
    console.log({ list, todo, currentUser: props.currentUser });
    /*  props.updateTodoList({
      name: props.list.name,
      todoList: newList,
    }); */
    firebase
      .firestore()
      .collection(props.currentUserId)
      .doc(list.id)
      .set(
        {
          name: list.name,
          todoList: newList,
        },
        { merge: true }
      )
      .then((e) => {
        console.log(e);
      });
  };

  const deleteCard = (event, list) => {
    event.stopPropagation();
    firebase.firestore()
      .collection(props.currentUserId)
      .doc(list.id)
      .delete()
      .then((e) => {
        console.log("deleted", list.name);
      });
  };

  if (props.list.id) {
    return (
      <Container maxWidth="lg" className={classes.container}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {props.lists?.map((list, index) => {
            return (
              <CardLayout
                deleteCard={(e) => deleteCard(e, list)}
                key={index}
                title={list.name}
                Component={() => {
                  return (
                    <Button
                      aria-label="edit"
                      className={classes.addTodoItemButton}
                      onClick={(event) => {
                        console.log("selecting list", list);
                        props.setSelectedList(list);
                        props.openNewTodoDialog();
                      }}
                      color="primary"
                      variant="contained"
                    >
                      Add Todo
                    </Button>
                  );
                }}
              >
                {list.todoList?.length > 0 ? (
                  <>
                    <h3>To Do</h3>
                    <ListGroup>
                      {list.todoList
                        .filter((e) => !e.isComplete)
                        .map((todo, i) => {
                          return (
                            <ListGroupItem key={i} color="info">
                              <div style={{ display: "flex" }}>
                                <div style={{ flexGrow: "4" }}>
                                  <h4>{todo.name}</h4>
                                  <p>{todo.detail}</p>
                                  <div>
                                    <b>Created: </b>
                                    <span>
                                      {calculateFullDate(todo.createDate).date}{" "}
                                      -{" "}
                                    </span>
                                    <span>
                                      [
                                      {calculateFullDate(todo.createDate).clock}
                                      ]
                                    </span>
                                  </div>
                                 {/*  <div>
                                    <b>Finish Date: </b>
                                    <span>
                                      {calculateFullDate(todo.date).date} -{" "}
                                    </span>
                                    <span>
                                      [{calculateFullDate(todo.date).clock}]
                                    </span>
                                  </div> */}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <IconButton
                                    onClick={(e) => {
                                      props.setSelectedList(list);
                                      checkboxToggle(e, todo, list);
                                    }}
                                  >
                                    <DoneIcon />
                                  </IconButton>
                                  {/* <IconButton>
                                    <EditIcon />
                                  </IconButton> */}
                                  <IconButton
                                    onClick={(e) => {
                                      props.setSelectedList(list);
                                      removeTodo(e, todo, list);
                                    }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </div>
                              </div>
                            </ListGroupItem>
                          );
                        })}
                    </ListGroup>
                    <div style={{ margin: "5px 0 5px 0" }}>
                      <Divider />
                    </div>
                    <h3>Done</h3>
                    <ListGroup>
                      {list.todoList
                        .filter((e) => e.isComplete)
                        .map((todo, i) => {
                          return (
                            <ListGroupItem key={i} color="success">
                              <div style={{ display: "flex" }}>
                                <div style={{ flexGrow: "4" }}>
                                  <h4>{todo.name}</h4>
                                  <p>{todo.detail}</p>
                                  <b>Created: </b>
                                  <span>
                                    {calculateFullDate(todo.date).date} -{" "}
                                  </span>
                                  <span>
                                    [{calculateFullDate(todo.date).clock}]
                                  </span>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                  }}
                                >
                                  <IconButton
                                    onClick={(e) => {
                                      props.setSelectedList(list);
                                      checkboxToggle(e, todo, list);
                                    }}
                                  >
                                    <CancelIcon />
                                  </IconButton>
                                  {/* <IconButton>
                                    <EditIcon />
                                  </IconButton> */}
                                </div>
                              </div>
                            </ListGroupItem>
                          );
                        })}
                    </ListGroup>
                  </>
                ) : (
                  <h5>No todo item</h5>
                )}
              </CardLayout>
            );
          })}
        </div>

        {/*       {props.list.todoList.length > 0 && (
          <div className={classes.root}>
            {filteredLists.map((list, index) => {
              const fullDate = calculateFullDate(list.date);
              return (
                <ExpansionPanel key={index}>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-label="Expand"
                    aria-controls="additional-actions1-content"
                    id="additional-actions1-header"
                  >
                    <FormControlLabel
                      className={classes.todoItemFormControl}
                      aria-label="Acknowledge"
                      onClick={(event) => {
                        checkboxToggle(event, list);
                      }}
                      onFocus={(event) => event.stopPropagation()}
                      control={<Checkbox checked={list.isComplete} />}
                      label={list.name}
                    />
                    <Typography className={classes.dateField}>
                      <DateIcon
                        className={classes.dateIcon}
                        color="secondary"
                      />
                      {fullDate.date}
                      <br />
                      {fullDate.clock}
                    </Typography>
                    <IconButton
                      aria-label="edit"
                      className={classes.optionButtons}
                      onClick={(event) => {
                        editTodo(event, list, index);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      className={classes.optionButtons}
                      onClick={(event) => {
                        removeTodo(event, list, index);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography color="textSecondary">{list.detail}</Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              );
            })}
          </div>
        )} */}
        {props.lists.length === 0 && (
          <div>
            <h5 style={{ textAlign: "center", padding: 25 }}>
              There is no to do Item in your list. You can add Todo Item.
            </h5>
          </div>
        )}
      </Container>
    );
  } else {
    return (
      <div>
        <h3 style={{ textAlign: "center", padding: 25 }}>
          No saved Todo List found, please first Todo from left menu Add your
          list.
        </h3>
      </div>
    );
  }
}

export default TodoItemList;
