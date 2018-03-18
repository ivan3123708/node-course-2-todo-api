const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const mongoose = require('./db/mongoose');
const _ = require('lodash');
const { User } = require('./models/user');
const { Todo } = require('./models/todo');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/todos', (req, res) => {
  Todo.find().then((foundTodos) => {
    res.send({ todos: foundTodos })
  }, (err) => {
    res.status(400).send(err);
  });
});

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  })
    .save()
    .then((savedTodo) => {
      res.send({ todo: savedTodo });
    }, (err) => {
      res.status(400).send(err);
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
    .catch((err) => {
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
    .catch((err) => {
      res.status(404).send();
    });
});

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then((patchedTodo) => {
      if (patchedTodo) {
        res.send({ todo: patchedTodo });
      } else {
        res.status(404).send();
      }
    })
    .catch((err) => {
      res.status(404).send();
    });
});

app.post('/users/', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  const user = new User(body);

  user.save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then((token) => {
      res.header('x-auth', token).send(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.listen(port, () => {
  console.log('SERVER NOW RUNNING...');
});

module.exports = { app };