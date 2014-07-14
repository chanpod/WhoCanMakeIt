'use Strict'
angular.module("Imn.controllers", ['Imn.services'])
    .controller("createEventController", ["$scope", 'CreateEventService', '$location', function($scope, CreateEventService, $location){
        $scope.event = {};

        $scope.submitEvent = function(){
            console.log($scope.event);
            var events = new CreateEventService($scope.event);

            console.log(events);

            events.$save();
        }
    }])
    .controller("homeController", ["$scope", function($scope){

        $scope.welcomeMessage = "Welcome to Imn"

    }])
    .controller("viewAllEventsController", ["$scope", 'EventService', '$location', function($scope, EventService, $location){

        var path = $location.path().split('/');
        var pathSize = path.length;

        $scope.events = [];
        $scope.welcomeMessage = "Find an event";

        if(pathSize === 2){
            console.log("No event ID");

            $scope.events = EventService.query();
        }

    }]).controller("viewEventController", ["$scope", 'EventService', '$location', 'SaveEventService', function($scope, EventService, $location, SaveEventService){

        var path = $location.path().split('/');
        var pathSize = path.length;
        $scope.event = {};
        $scope.iminResponse = true;
        $scope.hasBeenAdded = false;
        $scope.newAttendee = "";
        $scope.newAttendeeToAdd = {userName: ""};


        var eventService = EventService.getSingleEvent({"eventID":path[pathSize - 1]}, function(result){
            $scope.updateEvent();
        });


        $scope.updateEvent = function(){

            $scope.event.eventName = eventService[0].eventName;
            $scope.event._id = eventService[0]._id;
            $scope.event.attendees = eventService[0].attendees;


            $scope.welcomeMessage = $scope.event.eventName;
        };

        $scope.addAttendee = function(){

           var saveEvent = new SaveEventService($scope.event);
            console.log(saveEvent);
            saveEvent.$save();
        };

        $scope.ImIn = function(){

            $scope.newAttendeeToAdd.userName = $scope.newAttendee;

            if($scope.hasBeenAdded === false){
                $scope.event.attendees.push($scope.newAttendeeToAdd)
                $scope.hasBeenAdded = true;
            }
            else{
                $scope.event.attendees.pop();
                $scope.event.attendees.push($scope.newAttendeeToAdd)
            }

            console.log("Attendees" + $scope.event.attendees);

        };

        $scope.maybe = function(){

            $scope.newAttendeeToAdd.userName = $scope.newAttendee;

            if($scope.hasBeenAdded === false){
                $scope.event.maybe.push($scope.newAttendeeToAdd)
                $scope.hasBeenAdded = true;
            }
            else{
                $scope.event.maybe.pop();
                $scope.event.maybe.push($scope.newAttendeeToAdd)
            }
        }

        $scope.nopes = function(){

            $scope.newAttendeeToAdd.userName = $scope.newAttendee;

            if($scope.hasBeenAdded === false){
                $scope.event.nopes.push($scope.newAttendeeToAdd)
                $scope.hasBeenAdded = true;
            }
            else{
                $scope.event.nopes.pop();
                $scope.event.nopes.push($scope.newAttendeeToAdd)
            }
        }

    }]);







