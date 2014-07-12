var mongoose = require('mongoose');
exports.eventSchema = new mongoose.Schema(
                                {
                                    eventID: String,
                                    eventName: String,
                                    eventDate: String,
                                    eventTime : String,
                                    eventLocation: String,
                                    attendees: [{
                                        userName: String,
                                        attending: String
                                    }]
                                });

