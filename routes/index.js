var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'eventApp');
var eventSchema = require('../models/createEvent.js').eventSchema;
var event = db.model('events', eventSchema);


exports.viewEvent = function(req, res){


    console.log(req.params.eventID);

    if(req.params.eventID) {
        event.find({"eventID": req.params.eventID}, function (error, events) {
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
    console.log("Working");

   /* var eventObj = {eventName: reqBody.eventName, eventDate: reqBody.eventDate,
                    eventTime : reqBody.eventTime, eventLocation: reqBody.eventLocation};
    */

    var newEvent = new event(eventSchema);
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