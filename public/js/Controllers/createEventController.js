angular.module("Imn.controllers", ['Imn.services'])
    .controller("createEventController", ["$scope", function($scope, $location, eventService){
        $scope.event = {};

        $scope.submitEvent = function(){
            console.log($scope.event);
            var eventCreation = new eventService($scope.event);
            eventCreation.$save(function(p, resp){
                if(!p.error){
                    console.log("Success");
                }
                else{
                    console.log("Error: " + resp);
                }
            })
        }
    }]);
