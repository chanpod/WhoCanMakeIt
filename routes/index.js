var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'eventApp');
var eventSchema = require('../models/createEvent.js').eventSchema;
var event = db.model('events', eventSchema);


exports.viewEvent = function(req, res){


    console.log(req.params.eventID);

    if(req.params.eventID) {
        event.find({"_id": req.params.eventID}, function (error, events) {
            console.log(events);
            res.send(events);
        });
    }
    else{
        event.find({}, function (error, events) {
            console.log(events);
            res.send(events);
        })
    }
};

exports.createEvent = function(req, res){

    var reqBody = req.body;
    console.log(req.params.newEvent);
    console.log("Request Body: " + reqBody);
    console.log(reqBody);

    var testEvent = {
        eventID: "1",
        eventName: "Test",
        eventDate: "12/12/12",
        eventTime : "1:00pm",
        eventLocation: "Auburn",
        attendees: [{
            userName: "Chauncey",
            attending: "yes"
        }]
    };


    var newEvent = new event(reqBody);
    newEvent.save(function(err, doc) {
        if(err || !doc) {
            throw 'Error';
        } else {
            res.send(doc);
        }
    });
};


/*
 * GET home page.
 */

var title = "Imn";

exports.index = function(req, res){
  res.render('index');
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};