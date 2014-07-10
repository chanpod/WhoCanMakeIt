'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('Imn.services', ['ngResource']).
  factory('eventService', function($resource){
        return $resource('createEvent', {}, {
            query: {method:'GET', params: {}}
        })
    });
