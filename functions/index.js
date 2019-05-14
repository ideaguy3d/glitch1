const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const db = admin.database();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

/*
For now, lets use GET requests and grab data from URL query params

club profile text data, use app.get()

.com/api/club/profile/a/:action? // :action is a route variable, :action = post_club_data

    club-id=VALUE&

    club-name=VALUE&

    about-club=VALUE&

    top-drinks=VALUE&

    address=VALUE&

    site=VALUE&

    phone=VALUE&

    hours=VALUE

*/
exports.clubProfile = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // As an admin, the app has access to read and write all data, regardless of Security Rules
    if (req.method !== 'GET') {
      return res.status(500).json({
        message: 'Only GET request are allowed on this route',
      });
    }
    const ref = db.ref('users');
    ref.once('value', snapshot => {
      console.log('snapshot', snapshot.val());
      res.status(200).json({
        users: [snapshot.val()],
      });
    });
  });
});
