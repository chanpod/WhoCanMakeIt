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
    .controller("homeController", ["$scope", '$location', function($scope, $location){

        $scope.welcomeMessage = "Welcome to ImIn"

        $scope.createEvent = function(){
            $location.path("/createEvent");
        }

    }])
    .controller("gMapsController", ["$scope", '$location', function($scope, $location){
        $scope.welcomeMessage = "Welcome to Google Maps Playground"

        $scope.map = {
            center: {
                latitude: 44.41748017333282,
                longitude: 26.106005249023376
            },
            zoom: 11
        }
        $scope.id = 0;
        $scope.map.bounds = {};
        $scope.map.randomMarkers = [{
            id: 0,
            latitude: 44.42138408826953,
            longitude: 26.25385948707207,
            showWindow: false,
            title: "m9",
            draggable: true
        },
            {
            id: 1,
            latitude: 44.39138408826953,
            longitude: 26.21385948707207,
            showWindow: false,
            title: "m9",
            draggable: true
        }];

        $scope.id++;
        $scope.id++;

        angular.forEach($scope.map.randomMarkers, function(marker) {
            marker.showWindow = false;

            marker.onClick = function() {
                console.log('on click - opening window');
                marker.showWindow = true;
                $scope.$apply();
            }

            marker.closeClick = function() {
                console.log('close click - hiding window');
                marker.showWindow = false;
                $scope.$apply();
            }

            console.log(marker);

        });


        var generateMarkers = function(markers) {


            markers.showWindow = false;

            markers.onClick = function() {
                    console.log('on click - opening window');
                    markers.showWindow = true;
                    $scope.$apply();
                };

            markers.closeClick = function() {
                    console.log('close click - hiding window');
                    marker.showWindow = false;
                    $scope.$apply();
                };

                console.log(markers);


            $scope.map.randomMarkers.push(markers);

        };

        $scope.generateMarker = function(){
            var marker = {
                id: $scope.id,
                latitude: 44.41138408826953,
                longitude: 26.23385948707207,
                showWindow: false,
                title: "m9",
                draggable: true
            };
            console.log("marker added");
            generateMarkers(marker);
            $scope.id = $scope.id++;
        };

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
        $('addAttendee').prop('disabled', true);


        var eventService = EventService.getSingleEvent({"eventID":path[pathSize - 1]}, function(result){
            $scope.updateEvent();
        });


        $scope.updateEvent = function(){

            $scope.event.eventName = eventService[0].eventName;
            $scope.event._id = eventService[0]._id;
            $scope.event.eventDate = eventService[0].eventDate;
            $scope.event.eventTime = eventService[0].eventTime;
            $scope.event.eventLocation = eventService[0].eventLocation

            $scope.event.attendees = eventService[0].attendees;
            $scope.event.maybe = eventService[0].maybe;
            $scope.event.nopes = eventService[0].nopes;


            $scope.welcomeMessage = $scope.event.eventName;
        };

        $scope.addAttendee = function(){

           if($scope.newAttendee.length > 0 && ($scope.addedToYes === true ||
                                                $scope.addedToMaybe === true ||
                                                $scope.addedToNopes=== true)){

               var saveEvent = new SaveEventService();
               console.log(saveEvent);
               SaveEventService.update({eventID: $scope.event._id}, {data: $scope.event});
               $('#ImInQuestionair').modal('hide');
               $('#enterName').popover('hide');
           }
           else{
               $('#enterName').popover('show');
           }

        };

        $scope.ImIn = function(){

            $scope.newAttendeeToAdd.userName = $scope.newAttendee;

            if($scope.newAttendee.length > 0) {

                if ($scope.addedToYes === true) {

                }
                else {
                    if ($scope.addedToMaybe === true) {

                        $scope.addedToMaybe = false
                        $scope.event.maybe.pop();
                    }
                    else if ($scope.addedToNopes === true) {

                        $scope.addedToNopes = false
                        $scope.event.nopes.pop();
                    }

                    $scope.event.attendees.push($scope.newAttendeeToAdd)
                }

                $scope.addedToYes = true;

                console.log("Attendees" + $scope.event.attendees);
            }
            else{
                $('#enterName').popover('show');
            }

        };

        $scope.maybe = function(){

            $scope.newAttendeeToAdd.userName = $scope.newAttendee;

            if($scope.newAttendee.length > 0) {

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
            else{
                $('#enterName').popover('show');
            }
        }

        $scope.nopes = function(){

            $scope.newAttendeeToAdd.userName = $scope.newAttendee;

            if($scope.newAttendee.length > 0) {

                if ($scope.addedToNopes === true) {
                    //Do nothing
                }
                else {
                    if ($scope.addedToYes === true) {

                        $scope.addedToYes = false;
                        $scope.event.attendees.pop();
                    }
                    else if ($scope.addedToMaybe === true) {

                        $scope.addedToMaybe = false
                        $scope.event.maybe.pop();
                    }

                    $scope.event.nopes.push($scope.newAttendeeToAdd)
                }

                $scope.addedToNopes = true;
            }
            else{
                $('#enterName').popover('show');
            }
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







