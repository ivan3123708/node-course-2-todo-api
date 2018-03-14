const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const mongoose = require('./db/mongoose');
const { User } = require('./models/user');
const { Todo } = require('./models/todo');

const app = express();

app.use(bodyParser.json());

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({ todos })
  }, (e) => {
    res.status(400).send(e);
  });
});

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  })
    .save()
    .then((doc) => {
      res.send(doc);
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
    .then((todo) => {
      if (todo) {
        res.send({ todo });
      } else {
        res.status(404).send();
      }
    })
    .catch((e) => {
      res.status(404).send();
    })
});

app.listen(3000, () => {
  console.log('SERVER NOW RUNNING...');
});

module.exports = { app };