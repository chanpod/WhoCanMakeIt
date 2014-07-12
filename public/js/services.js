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
    });