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
        $scope.welcomeMessage = "Welcome to Google Maps Playground";

        function initialize() {
            var mapOptions = {
                center: new google.maps.LatLng(-33.8688, 151.2195),
                zoom: 13
            };
            var map = new google.maps.Map(document.getElementById('map-canvas'),
                mapOptions);

            var input = /** @type {HTMLInputElement} */(
                document.getElementById('pac-input'));

            var types = document.getElementById('type-selector');
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

            var autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo('bounds', map);

            var infowindow = new google.maps.InfoWindow();
            var marker = new google.maps.Marker({
                map: map,
                anchorPoint: new google.maps.Point(0, -29)
            });

            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                infowindow.close();
                marker.setVisible(false);
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    return;
                }

                // If the place has a geometry, then present it on a map.
                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport);
                } else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(17);  // Why 17? Because it looks good.
                }
                marker.setIcon(/** @type {google.maps.Icon} */({
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(35, 35)
                }));
                marker.setPosition(place.geometry.location);
                marker.setVisible(true);

                var address = '';
                if (place.address_components) {
                    address = [
                        (place.address_components[0] && place.address_components[0].short_name || ''),
                        (place.address_components[1] && place.address_components[1].short_name || ''),
                        (place.address_components[2] && place.address_components[2].short_name || '')
                    ].join(' ');
                }

                infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
                infowindow.open(map, marker);
            });

            // Sets a listener on a radio button to change the filter type on Places
            // Autocomplete.
            function setupClickListener(id, types) {
                var radioButton = document.getElementById(id);
                google.maps.event.addDomListener(radioButton, 'click', function() {
                    autocomplete.setTypes(types);
                });
            }

            setupClickListener('changetype-all', []);
            setupClickListener('changetype-establishment', ['establishment']);
            setupClickListener('changetype-geocode', ['geocode']);
        }

        google.maps.event.addDomListener(window, 'load', initialize);

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

    }]).controller("viewEventController", ["$scope", 'EventService', '$location', 'SaveEventService', '$timeout', function($scope, EventService, $location, SaveEventService, $timeout){

        var path = $location.path().split('/');
        var pathSize = path.length;
        $scope.event = {};
        $scope.iminResponse = true;
        $scope.isVisible = false;

        $scope.addedToYes = false;
        $scope.addedToMaybe = false;
        $scope.addedToNopes = false;

        $scope.newAttendee = "";
        $scope.newAttendeeToAdd = {userName: ""};
        $('addAttendee').prop('disabled', true);


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
                    alert("Geocode was not successful for the following reason: " + status);
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

        };

        $scope.refreshMap = function(){
            google.maps.event.trigger(map,'resize')
        }


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







