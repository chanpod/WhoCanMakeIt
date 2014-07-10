var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'eventApp');
var eventSchema = require('../models/createEvent.js').eventSchema;
var event = db.model('events', eventSchema);


exports.viewEvent = function(req, res){

    event.find({}, 'question', function(error, polls) {
        res.json(polls);
    });
};

exports.createEvent = function(req, res){

    var reqBody = req.body;

    var pollObj = {eventName: reqBody.eventName, eventDate: reqBody.eventDate,
                    eventTime : reqBody.eventTime, eventLocation: reqBody.eventLocation};
    var poll = new event(pollObj);
    poll.save(function(err, doc) {
        if(err || !doc) {
            throw 'Error';
        } else {
            res.json(doc);
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