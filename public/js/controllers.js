'use Strict'
angular.module("Imn.controllers", ['Imn.services'])
    .controller("createEventController", ["$scope", 'CreateEventService', '$location', function($scope, CreateEventService, $location){
        $scope.event = {};
        $scope.testEvent = {
            eventID: "12",
            eventName: "Test",
            eventDate: "12/12/12",
            eventTime : "1:00pm",
            eventLocation: "Auburn",
            attendees: [{
                userName: "Chauncey",
                attending: "yes"
            }]
        };

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

    }]).controller("viewEventController", ["$scope", 'EventService', '$location', function($scope, EventService, $location){

        var path = $location.path().split('/');
        var pathSize = path.length;
        $scope.event = {};
        $scope.iminResponse = true;

        EventService.getSingleEvent({"eventID":path[pathSize - 1]}, function(results){
            console.log(results);
            $scope.event = results[0];
            $scope.welcomeMessage = $scope.event.eventName;
        });

    }]);







