
// console.log('A');

// global variables
var input = $('#formInput')[0];
var submitBtn = $('#submitBtn')[0];
var radioBtnOption = $('.radioBtn')[0];

// google maps init
function initMap(){



    var mapDiv = $('#map')[0];
    var startLocation = {lat: -41.6965833, lng: 172.8771047};
    var map;
    var apiKey = 'AIzaSyCyqxMkhc31hKFwW7etsYUkj4PoaO0nSoo';

    // landing map
    map = new google.maps.Map(document.getElementById('map'), {
        center: startLocation,
        zoom: 5
        // disableDefaultUI: true
    });// /map

    // assigning to radios/
    var accom = $('#changetype-lodging')[0];
    var parks = $('#changetype-park')[0];
    var rest = $('#changetype-restaurant')[0]; 

    // grab elements from dom
    var infowindowContent = $('#infowindow-content')[0];

    // google infowindows
    var infowindow = new google.maps.InfoWindow();

    // init google auto complete
    var autocomplete = new google.maps.places.Autocomplete(input);

    // set auto complete for only NZ values
    autocomplete.setComponentRestrictions({'country':['nz']});

    // move map to where autoComplete value is
    autocomplete.bindTo('bounds', map);


    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });// this is ok


    // autoComplete event
    autocomplete.addListener('place_changed', function() {

        // get new loction lngLat
        var place = autocomplete.getPlace();

        // create a new map marker
        var marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
        });// /marker

        // infowindow.close();
        marker.setVisible(true);

        infowindow.setContent(infowindowContent);

        // location validation
        if (!place.geometry) {
            window.alert("No details available for : '" + place.name + "'" + " please select a location within New Zealand");
            return;
        }// /if

        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(12);
          }// /if

        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        // event listener icon info window in main location screen
        marker.addListener('click', function(){

            var address = '';

            if (place.address_components) {
                address = [
                    // (place.address_components[0] && place.address_components[0].short_name || ''),
                    // (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].long_name || '')
                ].join(' ');
            }// /if

            console.log(address);
            console.log(marker);
            // console.log(place.photos);

            infowindowContent.children['place-icon'].src = place.icon;
            infowindowContent.children['place-name'].textContent = place.name;
            infowindowContent.children['place-address'].textContent = address;
            infowindow.open(map, marker);

        }); // /marker.eventListener

        var myLat = place.geometry.location.lat();
        var myLong = place.geometry.location.lng();
        var latLng = {lat: myLat, lng: myLong};
        var service = new google.maps.places.PlacesService(map);

        // radio value selection + icons
        $('input[type=radio]').click(function () {

            // console.log(this.value);

            var placesNearByQuery = 'https://maps.googleapis.com/maps/api/place/textsearch/xml?query=' + this.value + '+in+' + place.name + '&key=' + apiKey;
            
            // console.log(placesNearByQuery);

            service.nearbySearch({
                location: latLng,
                radius: 1000,
                type: this.value
            }, callback);

            map = new google.maps.Map(document.getElementById('map'), {
                center: latLng,
                zoom: 15,
                disableDefaultUI: true
            });

        });// /radio Value


        // create markers from results
        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
                }
            }
        }// /callback

        // create markers for types
        function createMarker(place) {
            var placeLoc = place.geometry.location;
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                placeId: place.place_id
            }); // /marker

            // console.log(place.place_id);

            // click event on markers to show info
            google.maps.event.addListener(marker, 'click', function() {

            console.log(place);

                // get place details for each marker when clicked
                var placeDetails = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + place.place_id + '&key=' + apiKey;

                console.log(placeDetails);
                // requests from json

                $.getJSON(placeDetails).done(function(data){
                    console.log(data);
                });

                // first try:
                // $.get(placeDetails).done(function (data){
                //     console.log(data);
                // });

                // second try:
                // var xhr = new XMLHttpRequest();
                // xhr.open('GET', placeDetails, true);
                // xhr.onload = function(){
                //     console.log(xhr.responseText);
                // };
                // xhr.send();

                // third try:
                // fetch(placeDetails).then(function (response){
                //     return response.json();
                // }).then(function(json){
                //     console.log(json);
                // });

                // fourth try:
                // $.ajax({
                //     type: 'GET',
                //     url: placeDetails
                // }).done(function (data){
                //     console.log(data);
                // });

                // fifth try:
                // var xhr = new XMLHttpRequest();
                // xhr.open("GET", placeDetails, true);
                // xhr.setRequestHeader("X-My-Custom-Header", "some value");
                // xhr.onload = function () {
                //     console.log(xhr.responseText);
                // };
                // xhr.send();

                // sixth try:
                // $.ajax({
                //     xhrFields: {
                //         withCredentials: true
                //     },
                //     type: "GET",
                //     url: placeDetails
                // }).done(function (data) {
                //     console.log(data);
                // });



                // console.log(placeDetails);
                infowindow.setContent(place.name + '<br/>' + place.vicinity + '<br/>' + 'Rating: ' + place.rating + '<br/>' + 'www.placeholderwebsite.com' + '<br/>' +'<span id="getDirections"><a href="#"" ><i class="fas fa-compass"></i>Directions</a></span>');
                infowindow.open(map, this);

                // get the directions of the place
                $('#getDirections').click('click', function() {
                    var destination = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + currentLoc + '&destination=' + placeLoc + '&key=' + apiKey;  
                    var directionsService = new google.maps.DirectionsService;
                    var directionsDisplay = new google.maps.DirectionsRenderer;
                    var currentLoc = {lat: -41.279098, lng: 174.779838};

                    var marker = new google.maps.Marker({
                      position: currentLoc,
                      map: map
                    });

                    var request = {
                        origin: placeLoc,
                        destination: currentLoc,
                        travelMode: google.maps.TravelMode.DRIVING
                    };

                    directionsService.route(request, function (response, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(response);
                            directionsDisplay.setOptions({
                                suppressMarkers: true
                            });
                            console.log(placeLoc);
                        } 
                        else {
                            console.log("directionsService : " + status);
                        }
                    });


                }); /* get the directions */

                // console.log(placeDetails);

                console.log(placeDetails);



                // function reqListener(){
                //     console.log(this.responseText);
                // }

                // var oReq = new XMLHttpRequest();
                // oReq.addEventListener('load', reqListener);
                // oReq.open('GET', placeDetails);

                // console.log(oReq);





                // $.getJSON( placeDetails, function(data){
                //     var items = [];
                //     if(!empty($_POST)){
                //     console.log(items);
                // }
                // });

                

                // console.log(place.vicinity);
            
                // console.log(latLng);
                // var distinationLatLng = 
                // var destination = 'https://maps.googleapis.com/maps/api/directions/json?origin=75+9th+Ave+New+York,+NY&destination=MetLife+Stadium+1+MetLife+Stadium+Dr+East+Rutherford,+NJ+07073&key=' + apiKey  

                // $('#getDirections').click('click', function() {
                //     console.log(place);
                //     var destination = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + place + '&destination=' + placeLoc + '&key=' + apiKey;  
                //     var directionsService = new google.maps.DirectionsService;
                //     var directionsDisplay = new google.maps.DirectionsRenderer; 

                //     function calculateAndDisplayRoute(directionsService, directionsDisplay) {
                //         directionsService.route({
                //             origin: place,
                //             destination: placeLoc,
                //             destination: place.vicinity,
                //             travelMode: 'DRIVING'
                //         },
                //         function(response, status) {
                //             if (status === 'OK') {
                //                 directionsDisplay.setDirections(response);
                //             } else {
                //                 window.alert('Directions request failed due to ' + status);
                //                 }
                //         });
                //     }
                //     calculateAndDisplayRoute(directionsService, directionsDisplay);
                // }); // get the directions


            }); //  /info click event
        }// /createMarker
     }); /* /autoComplete event listener */
} /* /initMap */

// var id; 
//     if ('geolocation' in navigator) {
//         console.log("hello");
        
//         //console (options.enableHighAccuracy + " " + options.maximumAge + " " + options.timeout);
//         id = navigator.geolocation.watchPosition(successCallback);
//         console.log ("WatchID= "+ id);
//         navigator.geolocation.getCurrentPosition(successCallback);
            
//             function successCallback (position) {
                
//             console.log (position.coords.latitude);
//             console.log (position.coords.longitude);
//             }
//         function errorCallback (error) {
//             console.log ("sorry no postion available");
//         }
//         /*var options = {
//         enableHighAccuracy: true, 
//         maximumAge        : 30000, 
//         timeout           : 27000
//         };*/
//  navigator.geolocation.clearWatch(id);
//     }


