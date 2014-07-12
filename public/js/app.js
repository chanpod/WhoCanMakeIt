'use strict';

// Declare app level module which depends on filters, and services

angular.module('Imn', [
  'Imn.controllers',
  'Imn.filters',
  'Imn.services',
  'Imn.directives'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'home',
      controller: 'homeController'
    }).
    when('/createEvent', {
      templateUrl: 'createEvent',
      controller: 'createEventController'
    }).
      when('/viewEvent/:eventID', {
          templateUrl: 'viewEvent',
          controller: 'viewEventsController'
      }).
      when('/viewEvent', {
          templateUrl: 'viewEvent',
          controller: 'viewEventsController'
      }).
    otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
});
