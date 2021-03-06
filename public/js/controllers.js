'use Strict'
angular.module("Imn.controllers", ['Imn.services'])
    .controller("createEventController", ["$scope", 'CreateEventService', '$location', 'SendMail', function($scope, CreateEventService, $location, SendMail){
        $scope.event = {};
        $scope.date = {};
        $scope.event.emailAddress = "";
        $scope.event.emailAddressCheck = "";

        $scope.trim = function(stringToTrim){
            return stringToTrim.replace(/^\s+|\s+$/gm,'');
        };

        $('#eventName').popover({
            content: 'Name cannot be empty or contain only spaces.',
            trigger: 'manual'
        })

        $('#emailCheck').popover({
            content: 'Emails do not match. Please verify you have enter your email correclty.',
            trigger: 'manual'
        })

        $scope.validate = function(){

            var isValid = false;
            try {
                $scope.trim($scope.event.eventName);
                if ($scope.event.eventName || $scope.event.eventName.length > 0) {
                    $('#eventName').popover("hide");
                    isValid = true;
                }
                else {
                    $('#eventName').popover("show");
                    isValid = false;
                }

                $scope.trim($scope.event.emailAddress);
                $scope.trim($scope.event.emailAddressCheck);

                if($scope.event.emailAddress === $scope.event.emailAddressCheck && $scope.event.emailAddress.length > 0){
                    isValid = true;
                }
                else{
                    if($scope.event.emailAddress.length > 0){
                        $('#emailCheck').popover('show');
                    }

                    isValid = false;
                }
            }
            catch(err){
                console.log(err);

                return false;
            }

            return isValid;
        };

        $scope.submitEvent = function(){
            if($scope.validate()) {

                var events = new CreateEventService($scope.event);


                events.$save(function (response) {
                    console.log(response);
                    if($scope.event.emailAddress.length > 0){

                        var email = {
                            to : $scope.event.emailAddress,
                            from: "chanpod36@gmail.com",
                            subject: "Even Creation From WhoCanMakeIt",
                            text: response
                        }

                        var sendEmail = new SendMail(email);

                        sendEmail.$save(function(response){
                           console.log("The response: " + response);
                        });
                    }


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
    .controller("viewAllEventsController", ["$scope", 'EventService', '$location', 'SendMail', function($scope, EventService, $location, SendMail){

        var path = $location.path().split('/');
        var pathSize = path.length;

        $scope.events = [];
        $scope.welcomeMessage = "Find an event";

        if(pathSize === 2){
            console.log("No event ID");

            EventService.query(function(result){
                console.log(result)
                angular.forEach(result, function(event, key){

                    var date = new Date(event.eventDate);

                    if(date.toLocaleDateString() != "Invalid Date"){
                        event.eventDate = date.toLocaleDateString();
                        event.eventTime = date.toLocaleTimeString();
                    }
                });

                $scope.events = result;

            });
        }

        SendMail.query();


    }]).controller("viewEventController", ["$scope", 'EventService', '$location', 'SaveEventService', '$timeout', function($scope, EventService, $location, SaveEventService, $timeout){

        var path = $location.path().split('/');
        var pathSize = path.length;
        $scope.event = {};
        $scope.iminResponse = true;
        $scope.isVisible = false;

        $scope.editable = false;
        $scope.editButton = "Edit";

        $scope.addedToYes = false;
        $scope.addedToMaybe = false;
        $scope.addedToNopes = false;

        $scope.newAttendee = "";
        $scope.newAttendeeToAdd = {userName: ""};
        $('addAttendee').prop('disabled', true);

        $('#showMap').popover({
            content: 'No valid location could be found. Update the location if you wish to see it in Google Maps.',
            trigger: 'manual'
        })

        $scope.editFields = function(){
            $scope.editable = !$scope.editable
            if($scope.editable){
                $scope.editButton = "Save";
            }
            else{
                $scope.editButton = "Edit";
                $scope.saveEvent();
            }
        };

        $scope.tabs = [
            {
                "title":"ImIn",
                "template" : "TabJadeFiles/ImInTab.jade"
            },
            {
                "title": "Maybe",
                "template" : "TabJadeFiles/MaybeTab.jade"
            },
            {
                "title": "Not Coming",
                "template" : "TabJadeFiles/NotComingTab.jade"
            }
        ];

        $scope.tabs.active = 0;


        var map;
        function initialize() {
            var mapOptions = {
                zoom: 8,
                center: new google.maps.LatLng(-34.397, 150.644)
            };
            map = new google.maps.Map(document.getElementById('map-canvas'),
                mapOptions);
        }


        google.maps.event.addDomListener(window, 'load', initialize);



        var eventService = EventService.getSingleEvent({"eventID":path[pathSize - 1]}, function(result){
            $scope.updateEvent();
        });



        $scope.getLatLong = function(address){
            var geocoder = new google.maps.Geocoder();

            geocoder.geocode( { 'address': address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    //In this case it creates a marker, but you can get the lat and lng from the location.LatLng
                    map.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                    map.setZoom(13)

                } else {
                    console.log("Showing popover");
                    $('#showMap').popover('show');
                }
            });
        };

        $scope.reloadMaps = function(){

            initialize();

            $scope.getLatLong($scope.event.eventLocation);
        };

        $scope.showMap = function(){

            $scope.isVisible = !$scope.isVisible;
            console.log($scope.isVisible);

            if($scope.isVisible) {
                $timeout(function () {
                    $scope.reloadMaps();
                }, 200)
            }
            else{
                $('#showMap').popover('hide');
            }

        };

        $scope.refreshMap = function(){
            google.maps.event.trigger(map,'resize')
        }


        $scope.updateEvent = function(){

            $scope.event.eventName = eventService[0].eventName;
            $scope.event._id = eventService[0]._id;
            $scope.event.eventDate = new Date(eventService[0].eventDate);
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

               $scope.saveEvent();
               $('#ImInQuestionair').modal('hide');
               $('#enterName').popover('hide');
           }
           else{
               $('#enterName').popover('show');
           }

        };

        $scope.saveEvent = function(){
            var saveEvent = new SaveEventService();
            console.log(saveEvent);
            SaveEventService.update({eventID: $scope.event._id}, {data: $scope.event});
        }

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







