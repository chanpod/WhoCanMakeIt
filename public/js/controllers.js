'use Strict'
angular.module("Imn.controllers", ['Imn.services'])
    .controller("createEventController", ["$scope", 'EventService', '$location', function($scope, EventService, $location){
        $scope.event = {};

        $scope.submitEvent = function(){
            console.log($scope.event);
            var events = EventService.$update();

            console.log(events);

            //events.update();

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
        else{
            console.log("Event ID specified");

            EventService.getSingleEvent({"eventID":path[pathSize - 1]}, function(results){
                $scope.events = results;
            });
        }
    }]).controller("viewEventController", ["$scope", 'EventService', '$location', function($scope, EventService, $location){

        var path = $location.path().split('/');
        var pathSize = path.length;
        $scope.event = {};


        console.log("Working");

        EventService.getSingleEvent({"eventID":path[pathSize - 1]}, function(results){
            $scope.event = results[0];
            $scope.welcomeMessage = $scope.event.eventName;
        });

    }]);







