const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const serviceAccount = require('./maps1-408-firebase-adminsdk-b0r4e-707a7b4def.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://maps1-408.firebaseio.com',
});

const db = admin.database();

const app = express();

app.use(bodyParser.json());


app.get('/api/v1/', async (req, res) => {

const ref = db.ref('users');

ref.once('value', snapshot => {
  console.log('snapshot', snapshot.val());
  res.status(200).json({
    users: [snapshot.val()],
  });
});

});


//routes
require('./routes/clubRoutes')(app,db);


const PORT = process.env.PORT || 5000;
console.log('Listening on port', PORT);
app.listen(PORT);
