const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/todoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to mongoDB server');
  }

  console.log('Connected to MongoDB server');

  const db = client.db('todoApp');

  db.collection('Todos').insertOne({
    text: 'Something to do',
    completed: false
  }, (err, result) => {
    if (err) {
      return console.log('Unable to insert todo', err);
    }
    
    console.log(JSON.stringify(result.ops, null, 2));
  });

  db.collection('Users').insertOne({
    name: 'Ivan',
    age: 27,
    location: 'Belgrade'
  }, (err, result) => {
    if (err) {
      console.log(err);
    }

    console.log(JSON.stringify(result.ops, null, 2));
  })

  client.close();
});