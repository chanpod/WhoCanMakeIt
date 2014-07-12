'use Strict'
angular.module("Imn.controllers", ['Imn.services'])
    .controller("createEventController", ["$scope", 'EventService', function($scope, EventService){
        $scope.event = {};

        $scope.submitEvent = function(){
            console.log($scope.event);
            var events = EventService($scope.event);

            EventService($scope.event).$save(function(p, resp){
                if(!p.error){
                    console.log("Success");
                }
                else{
                    console.log("Error: " + resp);
                }
            })

        }
    }])
    .controller("homeController", ["$scope", function($scope){

        $scope.welcomeMessage = "Welcome to Imn"

    }])
    .controller("viewEventsController", ["$scope", 'EventService', '$location', function($scope, EventService, $location){

        var path = $location.path().split('/');
        var pathSize = path.length;
        $scope.events = [];

        if(pathSize === 2){
            console.log("No event ID");

            $scope.events = EventService.query();

        }
        else{
            console.log("Event ID specified");

            EventService.getSingleEvent({"eventID":"1234"}, function(results){
                $scope.events = results;
            });
        }
    }]);







