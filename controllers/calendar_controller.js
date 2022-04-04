const express = require('express'),
  router = express.Router();
const app = express();
const fs = require('fs');

const Event = require('../models/event_model');
const User = require('../models/user_model');

const {google} = require("googleapis");
const calendar = google.calendar("v3");

var users = fs.readFileSync("../data/users.json");
var events = fs.readFileSync("../data/events.json");

function loggedIn(request, response, next) {
  if (request.user) {
    next();
  } else {
    response.redirect('/login');
  }
}

router.get("/event/:path/cal") {

  let attendeeList = [];

  let keyEvent = events[eventID];
  for (let member of keyEvent[members]) {
    attendeeList.push(users[member].email);
  }//This is what makes intuitive sense vis a vis an attendee list, an arry of email addresses. See line 36 for more comment

  //this is the function that should be called when a button is clicked, which adds that event to the user's main calendar
  var event = {
    'summary': eventID, //event name
    'location': 'Trinity School',
    'description': events[eventID].description, //event description,
    'start': {
      'date': (events[eventID].date),
      'timeZone': 'America/New_York',
    },
    "endTimeUnspecified": true,
    'attendees': [{
        'email': 'lpage@example.com'
      }, //Unfortunately, the attendee list is not an array of emails, but a list of objects with the property "email" and the address listed. Automating this is the one barrier to full integration of the calendar API.
      {
        'email': 'sbrin@example.com'
      },
    ],
    'reminders': {
      'useDefault': true,
    },
  };

  //I've left this here to illustrate what an event should look like.
  //Once we've made it such that our events can be read as cal events, all that is required is to call the function below to add the event to the cal.

  calendar.events.insert({
    auth: auth,
    calendarId: 'primary',
    resource: event,
  }, function(err, event) {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      return;
    }
    console.log('Event created: %s', event.htmlLink);
  });
}
