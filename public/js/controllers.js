'use Strict'
angular.module("Imn.controllers", ['Imn.services'])
    .controller("createEventController", ["$scope", 'CreateEventService', '$location', function($scope, CreateEventService, $location){
        $scope.event = {};

        $scope.validate = function(){
            if($scope.event.eventName || $scope.event.eventName.length > 0){
                return true;
            }
            else{
                return false;
            }
        };

        $scope.submitEvent = function(){
            if($scope.validate()) {
                console.log($scope.event);
                var events = new CreateEventService($scope.event);

                console.log(events);

                events.$save(function (response) {
                    console.log(response);
                    $location.path("/viewEvent/" + response._id)
                });
            };
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

        $scope.addedToYes = false;
        $scope.addedToMaybe = false;
        $scope.addedToNopes = false;

        $scope.newAttendee = "";
        $scope.newAttendeeToAdd = {userName: ""};


        var eventService = EventService.getSingleEvent({"eventID":path[pathSize - 1]}, function(result){
            $scope.updateEvent();
        });


        $scope.updateEvent = function(){

            $scope.event.eventName = eventService[0].eventName;
            $scope.event._id = eventService[0]._id;
            $scope.event.eventDate = eventService[0].eventDate;
            $scope.event.eventTime = eventService[0].eventTime;

            $scope.event.attendees = eventService[0].attendees;
            $scope.event.maybe = eventService[0].maybe;
            $scope.event.nopes = eventService[0].nopes;


            $scope.welcomeMessage = $scope.event.eventName;
        };

        $scope.addAttendee = function(){

           var saveEvent = new SaveEventService();
            console.log(saveEvent);
            SaveEventService.update({eventID: $scope.event._id}, {data: $scope.event});
        };

        $scope.ImIn = function(){

            $scope.newAttendeeToAdd.userName = $scope.newAttendee;

            if($scope.addedToYes === true){

            }
            else{
                if($scope.addedToMaybe === true){

                    $scope.addedToMaybe = false
                    $scope.event.maybe.pop();
                }
                else if($scope.addedToNopes === true){

                    $scope.addedToNopes = false
                    $scope.event.nopes.pop();
                }

                $scope.event.attendees.push($scope.newAttendeeToAdd)
            }

            $scope.addedToYes = true;

            console.log("Attendees" + $scope.event.attendees);

        };

        $scope.maybe = function(){

            $scope.newAttendeeToAdd.userName = $scope.newAttendee;

            if($scope.addedToMaybe === true){

            }
            else{
                if($scope.addedToYes === true){

                    $scope.addedToYes = false
                    $scope.event.attendees.pop();
                }
                else if($scope.addedToNopes === true){

                    $scope.addedToNopes = false
                    $scope.event.nopes.pop();
                }

                $scope.event.maybe.push($scope.newAttendeeToAdd)
            }

            $scope.addedToMaybe = true;
        }

        $scope.nopes = function(){

            $scope.newAttendeeToAdd.userName = $scope.newAttendee;

            if($scope.addedToNopes === true){
                //Do nothing
            }
            else{
                if($scope.addedToYes === true){

                    $scope.addedToYes = false;
                    $scope.event.attendees.pop();
                }
                else if($scope.addedToMaybe === true){

                    $scope.addedToMaybe = false
                    $scope.event.maybe.pop();
                }

                $scope.event.nopes.push($scope.newAttendeeToAdd)
            }

            $scope.addedToNopes = true;
        }

        $scope.nevermind = function(){

            if($scope.addedToYes === true){

                $scope.addedToYes = false;
                $scope.event.attendees.pop();
            }
            else if($scope.addedToMaybe === true){

                $scope.addedToMaybe = false
                $scope.event.maybe.pop();
            }
            else if($scope.addedToNopes === true){

                $scope.addedToNopes = false
                $scope.event.nopes.pop();
            }
        }

    }]);







