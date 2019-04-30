
# Firebase Database Quickstart
This app provides a useful starting point for building your own web app using Firebase, Google's cloud backend as a service.


### User stories :

1. The API endpoint is `GET [project_url]/api/timestamp/:date_string?`
2. A date string is valid if can be successfully parsed by `new Date(date_string)` (JS) . Note that the unix timestamp needs to be an **integer** (not a string) specifying **milliseconds**. In our test we will use date strings compliant with ISO-8601 (e.g. `"2016-11-20"`) because this will ensure an UTC timestamp.
3. If the date string is **empty** it should be equivalent to trigger `new Date()`, i.e. the service uses the current timestamp.
4. If the date string is **valid** the api returns a JSON having the structure 
`{"unix": <date.getTime()>, "utc" : <date.toUTCString()> }`
e.g. `{"unix": 1479663089000 ,"utc": "Sun, 20 Nov 2016 17:31:29 GMT"}`.
5. If the date string is **invalid** the api returns a JSON having the structure `{"unix": null, "utc" : "Invalid Date" }`. It is what you get from the date manipulation functions used above.

#### Example usage:
* https://curse-arrow.hyperdev.space/api/timestamp/2015-12-15
* https://curse-arrow.hyperdev.space/api/timestamp/1450137600000

#### Example output:
* { "unix": 1450137600, "natural": "December 15, 2015" }

Firebase Node.js Realtime Database Quickstart
==========================================

The Node.js Firebase Database quickstart demonstrates how to connect to and use the Firebase Realtime Database using Node.js through a simple social blogging app. It will interoperate with the Web, iOS and Android database quickstarts.

This server will:
 - Update the star counts for all posts.
 - Send email notifications when a post has been starred.
 - Send weekly emails listing top post.

Introduction
------------

- [Read more about Firebase Database](https://firebase.google.com/docs/database/)

Getting Started
---------------

- Create your project on the [Firebase Console](https://console.firebase.google.com).
- Create a service account as described in [Adding Firebase to your Server](https://firebase.google.com/docs/server/setup) and drop the file in this directory. Or use the provided test service account.
- Change the `<PROJECT_ID>` and `<PATH_TO_SERVICE_ACCOUNT_CREDENTIAL_FILE>` placeholders in [`index.js`](index.js).
- Configure your email transport in [`index.js`](index.js).
- Run `npm install`.
- Run `node index.js` to run the Node.js app locally.
- Configure and run one of the Database quickstarts for [Web](https://github.com/firebase/quickstart-js/tree/master/database), [iOS](https://github.com/firebase/quickstart-ios/tree/master/database) or [Android](https://github.com/firebase/quickstart-android/tree/master/database). Then use one of these apps to publish new posts: you should receive email notifications when one of your posts have received a new star and the starred counter should be kept up to date by the app.

Support
-------

https://firebase.google.com/support/

License
-------

© Google, 2016. Licensed under an [Apache-2](../LICENSE) license.
