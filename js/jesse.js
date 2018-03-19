

console.log('A');

// global variables
var input = $('#formInput')[0];
var submitBtn = $('#submitBtn')[0];
var radioBtnOption = $('.radioBtn')[0];

// google maps init
function initMap(){

    var mapDiv = $('#map')[0];
    var startLocation = {lat: -41.6965833, lng: 172.8771047};
    var map;

    // landing map
    map = new google.maps.Map(document.getElementById('map'), {
        center: startLocation,
        zoom: 5,
        disableDefaultUI: true
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

    // var map, infoWindow;
    // infoWindow = new google.maps.InfoWindow;

    //     if (navigator.geolocation) {
    //       navigator.geolocation.getCurrentPosition(function(position) {
    //         var pos = {
    //           lat: position.coords.latitude,
    //           lng: position.coords.longitude
    //         };

    //         infoWindow.setPosition(pos);
    //         infoWindow.setContent('Location found.');
    //         infoWindow.open(map);
    //         map.setCenter(pos);
    //       }, function() {
    //         handleLocationError(true, infoWindow, map.getCenter());
    //       });
    //     } else {
    //       // Browser doesn't support Geolocation
    //       handleLocationError(false, infoWindow, map.getCenter());
    //     }

    //   function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    //     infoWindow.setPosition(pos);
    //     infoWindow.setContent(browserHasGeolocation ?
    //                           'Error: The Geolocation service failed.' :
    //                           'Error: Your browser doesn\'t support geolocation.');
    //     infoWindow.open(map);
    // }

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

            console.log(place);
            console.log(place.photos);

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

            console.log(this.value);

            var apiKey = 'AIzaSyCyqxMkhc31hKFwW7etsYUkj4PoaO0nSoo'
            var placesNearByQuery = 'https://maps.googleapis.com/maps/api/place/textsearch/xml?query=' + this.value + '+in+' + place.name + '&key=' + apiKey;

            console.log(placesNearByQuery);

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

        // ---- this code creates custom photo markers (the other create marker function must be commented out)
        // function createMarker(place) {
        //     var photos = place.photos;
        //     if (!photos) {
        //         return;
        //     }

        //     var marker = new google.maps.Marker({
        //         map: map,
        //         position: place.geometry.location,
        //         title: place.name,
        //         icon: photos[0].getUrl({'maxWidth': 35, 'maxHeight': 35})
        //     });
        // }

        // create markers for types
        function createMarker(place) {
            var placeLoc = place.geometry.location;
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                placeId: place.place_id
            }); // /marker

            console.log(place.place_id);

            // click event on markers to show info
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(place.name + '<br/>' + place.vicinity + '<br/>' + '<span id="getDirections"><a href="#"" >Get direction</a></span>');
                infowindow.open(map, this);
            
                $('#getDirections').click('click', function() {
                    alert('getDirections works');
                });

            }); //  /info click event


        }// /createMarker

    

     }); /* /autoComplete event listener */


} /* /initMap */

