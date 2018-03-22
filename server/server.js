const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const mongoose = require('./db/mongoose');
const _ = require('lodash');
const { User } = require('./models/user');
const { Todo } = require('./models/todo');
const { authenticate } = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/todos', authenticate, (req, res) => {
  Todo.find({ _creator: req.user._id })
    .then((foundTodos) => {
      res.send({ todos: foundTodos })
    }, (err) => {
      res.status(400).send(err);
    });
});

app.post('/todos', authenticate, (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  })
    .save()
    .then((savedTodo) => {
      res.send({ todo: savedTodo });
    }, (err) => {
      res.status(400).send(err);
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;
  
  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOne({
    _creator: req.user._id,
    _id: id
  })
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

  Todo.findOneAndRemove({
    _creator: req.user._id,
    _id: id
  })
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

app.patch('/todos/:id', authenticate, (req, res) => {
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

  Todo.findOneAndUpdate({
    _creator: req.user._id,
    _id: id
  }, 
  { $set: body }, 
  { new: true })
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

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
    .then((user) => {
      return user.generateAuthToken()
        .then((token) => {
          res.header('x-auth', token).send(user);
        });
    })
    .catch((err) => {
      res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token)
    .then(() => {
      res.status(200).send();
    }, () => {
      res.status(400).send();
    });
});

app.listen(port, () => {
  console.log('SERVER NOW RUNNING...');
});

module.exports = { app };