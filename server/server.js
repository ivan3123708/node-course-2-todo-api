const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const mongoose = require('./db/mongoose');
const { User } = require('./models/user');
const { Todo } = require('./models/todo');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/todos', (req, res) => {
  Todo.find().then((foundTodos) => {
    res.send({ todos: foundTodos })
  }, (e) => {
    res.status(400).send(e);
  });
});

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  })
    .save()
    .then((savedTodo) => {
      res.send({ todo: savedTodo });
    }, (e) => {
      res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  
  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id)
    .then((foundTodo) => {
      if (foundTodo) {
        res.send({ todo: foundTodo });
      } else {
        res.status(404).send();
      }
    })
    .catch((e) => {
      res.status(404).send();
    })
});

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id)
    .then((removedTodo) => {
      if (removedTodo) {
        res.send({ todo: removedTodo });
      } else {
        res.status(404).send();
      }
    })
    .catch((e) => {
      res.send(404);
    });
});

app.listen(port, () => {
  console.log('SERVER NOW RUNNING...');
});

module.exports = { app };