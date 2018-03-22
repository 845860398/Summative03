// global variables
var input = $('#formInput')[0];
var submitBtn = $('#submitBtn')[0];
var radioBtnOption = $('.radioBtn')[0];

// google maps init
function initMap(){
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var currentLoc = {lat: -41.279098, lng: 174.779838};
    directionsDisplay.setMap(map);

    var mapDiv = $('#map')[0];
    var startLocation = {lat: -41.6965833, lng: 172.8771047};
    var map;
    var apiKey = 'AIzaSyCyqxMkhc31hKFwW7etsYUkj4PoaO0nSoo';

    // landing map
    map = new google.maps.Map(document.getElementById('map'), {
        center: startLocation,
        zoom: 5
    });// /map

    // assigning to radios
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
    });// /this is ok

    // hides the homepage
    $('.tapCont').on('click', function() {
        $('#homepage').hide('hide')
    });

    // opens the info content
    $('#helpButton').on('click', function() {
        $('#helpContainer').fadeIn(500)
    });

    // hides the info content
    $('#helpContainer').on('click', function() {
        $('#helpContainer').fadeOut(500)
    });

    // autoComplete event
    autocomplete.addListener('place_changed', function() {

        // get new loction lngLat
        var place = autocomplete.getPlace();

        // create a new map marker
        var marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
        });// /marker

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
                    (place.address_components[2] && place.address_components[2].long_name || '')
                ].join(' ');
            }// /if

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
            var placesNearByQuery = 'https://maps.googleapis.com/maps/api/place/textsearch/xml?query=' + this.value + '+in+' + place.name + '&key=' + apiKey;

            service.nearbySearch({
                location: latLng,
                radius: 1000,
                type: this.value
            }, callback);

            map = new google.maps.Map(document.getElementById('map'), {
                center: latLng,
                zoom: 15,
                disableDefaultUI: false
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
            var placeLoc = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                placeId: place.place_id
            }); // /marker

            // click event on markers to show info
            google.maps.event.addListener(marker, 'click', function() {

                // get place details for each marker when clicked
                var placeDetails = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + place.place_id + '&key=' + apiKey;

                

                infowindow.setContent('<div id=photoPlaceholder></div>' + place.name + '<br/>' + place.vicinity + '<br/>' + 'Rating: ' + place.rating + '<br/>' + 'www.placeholderwebsite.com' + '<br/>' +'<span class="getDirections"><a href="#"" ><i class="fas fa-compass"></i>Directions</a></span>');
                infowindow.open(map, this);

                // get the directions of the place
                $('.getDirections').click('click', function() {
                    var getDirections = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + placeLoc + '&destination=' + currentLoc + '&key=' + apiKey;  

                    var marker = new google.maps.Marker({
                      position: currentLoc,
                      map: map
                    });

                    var request = {
                        origin: placeLoc,
                        destination: currentLoc,
                        travelMode: google.maps.TravelMode.DRIVING
                    };
                }); // /get directions
            }); //  /info click event
        }// /createMarker
     });// /autoComplete event listener
}// /initMap



