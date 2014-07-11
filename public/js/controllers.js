'use Strict'
angular.module("Imn.controllers", ['Imn.services'])
    .controller("createEventController", ["$scope", 'EventService', function($scope, $location, EventService){
        $scope.event = {};

        $scope.submitEvent = function(){
            console.log($scope.event);
            var events = EventService($scope.event);

             events.$save(function(p, resp){
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
    .controller("viewEventController", ["$scope", 'EventService', function($scope, EventService, $request){

        $scope.events = EventService.query();
        console.log($scope.events);

    }]);







