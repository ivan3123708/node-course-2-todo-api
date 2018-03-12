const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to mongoDB server');
  }

  console.log('Connected to MongoDB server');

  const db = client.db('todoApp');

  // delete many
  // db.collection('Todos').deleteMany({ text: 'Jerk off' }).then((result) => {
  //     console.log(result);
  //     client.close();
  //   }
  // );

  // delete one
  // db.collection('Todos').deleteOne({ text: 'Kill something'}).then((result) => {
  //   console.log(result);
  //   client.close();
  // });

  // find one and delete
  // db.collection('Todos').findOneAndDelete({ completed: false }).then((result) => {
  //   console.log(result);
  //   client.close();
  // });

  // db.collection('Todos').deleteMany({ text: 'Something to do' }).then((result) => {
  //   console.log(`Deleted ${result.deletedCount} documents`);
  //   client.close();
  // });

  db.collection('Users').deleteMany({ name: 'Ivan' }).then((result) => {
    console.log(`Deleted ${result.deletedCount} documents`);
    client.close();
  });

  db.collection('Users').findOneAndDelete({ _id: new ObjectID('5aa570eeb2ad882224db2709') }).then(() => console.log('Deleted Jovan'));
});