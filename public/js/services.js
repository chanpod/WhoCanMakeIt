'use strict';

/* Services */
var service = angular.module("Imn.services", ["ngResource"]);

service.factory('EventService', function($resource){
        return $resource('viewEvent/:eventID',
            {eventID:"@eventID"}
        );
    });
