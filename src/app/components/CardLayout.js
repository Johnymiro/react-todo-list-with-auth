import React from "react";
import { makeStyles } from "@material-ui/core";
import { Card } from "react-bootstrap";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import { Button } from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  cardMain: {
    padding: "0px",
    margin: "5px",
    width: "400px",
  },

  cardBody: {
    margin: 0,
    padding: 0,
  },

  title: {
    display: "flex",
    justifyContent: "space-between",
    padding: "17px 10px",
    backgroundColor: "listgrey",
    height: "62px",
  },

  flexContainer: {
    display: "flex",
    flexDirection: "column",
    padding: "5px",
  },

  flexItem: {
    height: "45px",
    backgroundColor: "lightgrey",
    margin: "3px",
  },

  paper: {
    overflow: "auto",
  },
  fixedHeight: {
    height: "480px",
  },
}));

const CardLayout = ({ title, children, Component, deleteCard }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Card variant="" className={classes.cardMain}>
        <Card.Header className={classes.title}>
        {Component && <Component />}
          
          <h5>{title}</h5>
          <Button variant="contained" onClick={(e) => {
              console.log("deleting")
              deleteCard(e)}}>
            Delete
          </Button>
          
        </Card.Header>

        <Card.Body className={classes.cardBody}>
          <Paper className={clsx(classes.paper, classes.fixedHeight)}>
            {children}
          </Paper>
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

export default CardLayout;
