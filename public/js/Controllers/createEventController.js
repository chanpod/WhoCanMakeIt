angular.module("Imn.controllers", [])
    .controller("createEventController", ["$scope", function($scope){
        $scope.event = {};

        $scope.submitEvent = function(){
            console.log($scope.event);
        }
    }]);
