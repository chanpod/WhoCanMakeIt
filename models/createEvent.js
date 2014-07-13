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
                                    }],
                                    maybe: [{
                                        userName: String,
                                        attending: String
                                    }],
                                    nopes: [{
                                        userName: String,
                                        attending: String
                                    }]
                                });

