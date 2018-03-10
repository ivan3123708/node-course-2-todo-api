const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to mongoDB server');
  }

  console.log('Connected to MongoDB server');

  const db = client.db('todoApp');

  db.collection('Todos').find({ _id: new ObjectID('5aa411079e06508480d3c862') }).toArray().then((docs) => {
    console.log(JSON.stringify(docs, null, 2));
    client.close();
  }, (err) => {
    console.log(err);
    client.close();
  });
});