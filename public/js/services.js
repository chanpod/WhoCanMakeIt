'use strict';

/* Services */
var service = angular.module("Imn.services", ["ngResource"]);

service.factory('EventService', function($resource){
        return $resource('api/viewEvent/:eventID',
            {eventID:"@eventID"},
            {
                'getSingleEvent': {
                url: "api/viewEvent/:eventID",
                method: "GET",
                isArray: true
               }
            }
        );
    }).factory('CreateEventService', function($resource){
         return $resource('api/createEvent');
    }).factory('SaveEventService', function($resource){
         return $resource('api/saveEvent',
             {
                 'update' : {
                     url: "api/saveEvent",
                     method :"PUT"
                 }
             });
    });