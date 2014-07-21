var mongoose = require('mongoose');
exports.eventSchema = new mongoose.Schema(
                                {
                                    eventName: String,
                                    eventDate: String,
                                    eventTime : String,
                                    eventLocation: String,
                                    attendees: [{
                                        userName: String,
                                        response: Number
                                    }]
                                });

