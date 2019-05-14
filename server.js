
// I NEED YOUR HELP WITH THESE !!! ^_^ 

// https://firebase.google.com/docs/reference/node
// https://developers.google.com/maps/documentation/javascript/tutorial
// https://developers.google.com/maps/documentation/javascript/reference


var firebase = require('firebase');
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');
var Promise = require('promise');
var escape = require('escape-html');
var http = require('http'); 
var cors = require('cors');

var serverStartTime = Math.floor(new Date() / 1);

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC, some legacy browsers choke on 204 
app.use(cors({optionSuccessStatus: 200})); 

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// Configure the email transport using the default SMTP transport and a GMail account.
// See: https://nodemailer.com/
// For other types of transports (Amazon SES, Sendgrid...) see https://nodemailer.com/2-0-0-beta/setup-transporter/
var mailTransport = nodemailer.createTransport(
  'smtps://'+process.env.GMAIL_USERNAME+'%40gmail.com:' +
  process.env.GMAIL_PASSWORD+'@smtp.gmail.com'
);

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// firebaseNode.on (function(){  }); 

// https://ahead-oregano.glitch.me/api/hello

// document.getElementByID()

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  
  res.json({
    greeting: 'hello API',
    user1location: "10.654, 855.2354",
    user2location: "52.124, 23.98"
  });

});


app.get("/api/timestamp/:date_string?", function (req, res) {
  

});


//--------------------------------------------------------------------
// ---- THE FIREBASE NODE.JS API CLIENT / ADMIN CODE !!!!!!!!!!! ----
//--------------------------------------------------------------------

// [START initialize]
// Initialize the app with a service account, granting admin privileges
firebase.initializeApp({
  databaseURL: "https://maps1-408.firebaseio.com",
  serviceAccount: {
        projectId: process.env.PROJECT_ID,
        clientEmail: process.env.CLIENT_EMAIL,
        privateKey: process.env.PRIVATE_KEY
    }  
});

// Save the date at which we last tried to send a notification
function updateNotification(uid, postId){
  var update = {};
  update['/posts/' + postId + '/lastNotificationTimestamp'] =
    firebase.database.ServerValue.TIMESTAMP;
  update['/user-posts/' + uid + '/' + postId + '/lastNotificationTimestamp'] =
    firebase.database.ServerValue.TIMESTAMP;
  firebase.database().ref().update(update);
}

/**
 * Send a new star notification email to the user with the given UID.
 */
// [START single_value_read]
function sendNotificationToUser(uid, postId) {
  // Fetch the user's email.
  var userRef = firebase.database().ref('/users/' + uid);
  userRef.once('value').then(function(snapshot) {
    var email = snapshot.val().email;
    var postRef = firebase.database().ref('/posts/' + postId);

    postRef.once('value').then(function(thepost) {

      // Stop notifications for old stars
      if(
        !thepost.val().lastNotificationTimestamp || 
        thepost.val().lastNotificationTimestamp>serverStartTime
      ) {

        // Send the email to the user.
        if (email) {
          sendNotificationEmail(email).then(function() {
            updateNotification(uid, postId);
          }, function(reason) { // Email send failure
            console.log(reason); // Error
        });
        }
      } 
      else {
        updateNotification(uid, postId);
      }
    });
  }).catch(function(error) {
    console.log('Failed to send notification to user:', error);
  });
}
// [END single_value_read]

/**
 * Send the new star notification email to the given email.
 */
function sendNotificationEmail(email) {
  var mailOptions = {
    from: '"Firebase Database Quickstart" <noreply@firebase.com>',
    to: email,
    subject: 'New star!',
    text: 'One of your posts has received a new star!'
  };
  return mailTransport.sendMail(mailOptions).then(function() {
    console.log('New star email notification sent to: ' + email);
  });
}

/**
 * Update the star count.
 */
// [START post_stars_transaction]
function updateStarCount(postRef) {
  postRef.transaction(function(post) {
    if (post) {
      post.starCount = post.stars ? Object.keys(post.stars).length : 0;
    }
    return post;
  });
}
// [END post_stars_transaction]

/**
 * Keep the likes count updated and send email notifications for new likes.
 */
function startListeners() {
  firebase.database().ref('/posts').on('child_added', function(postSnapshot) {
    var postReference = postSnapshot.ref;
    var uid = postSnapshot.val().uid;
    var postId = postSnapshot.key;
    // Update the star count.
    // [START post_value_event_listener]
    postReference.child('stars').on('value', function(dataSnapshot) {
      updateStarCount(postReference);
      // [START_EXCLUDE]
      updateStarCount(firebase.database().ref('user-posts/' + uid + '/' + postId));
      // [END_EXCLUDE]
    }, function(error) {
      console.log(
        'Failed to add "value" listener at /posts/' + postId + '/stars node:', error
      );
    });
    // [END post_value_event_listener]
    // Send email to author when a new star is received.
    // [START child_event_listener_recycler]
    postReference.child('stars').on('child_added', function(dataSnapshot) {
      sendNotificationToUser(uid, postId);
    }, function(error) {
      console.log(
        'Failed to add "child_added" listener at /posts/' + postId + '/stars node:', 
        error
      );
    });
    // [END child_event_listener_recycler]
  });

  console.log('New star notifier started...');
  console.log('Likes count updater started...');
  
}

// Start the Firebase server
startListeners();













// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});