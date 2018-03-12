const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to mongoDB server');
  }

  console.log('Connected to MongoDB server');

  const db = client.db('todoApp');

  // db.collection('Todos').findOneAndUpdate({ 
  //   _id: new ObjectID('5aa570eeb2ad882224db2708') 
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  //   client.close();
  // });

  db.collection('Users').findOneAndUpdate({ 
    _id: new ObjectID('5aa574ad01082320444f7b60') 
  }, {
    $set: {
      name: 'Jashar'
    },
    $inc: {
      age: -5
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
    client.close();
  });
});