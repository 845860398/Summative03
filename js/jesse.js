

console.log('A');

// global variables
var input = $('#formInput')[0];
var submitBtn = $('#submitBtn')[0];

// google maps init
function initMap(){

    var mapDiv = $('#map')[0];
    var startLocation = {lat: -40.9006, lng: 174.8860};
    var map;

    // landing map
    map = new google.maps.Map(document.getElementById('map'), {
        center: startLocation,
        zoom: 4,
        disableDefaultUI: true
    });

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
    });

    autocomplete.addListener('place_changed', function() {

        infowindow.close();
        marker.setVisible(false);

        var place = autocomplete.getPlace();

        infowindow.setContent(infowindowContent);

        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(12);
          }
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

        infowindowContent.children['place-icon'].src = place.icon;
        infowindowContent.children['place-name'].textContent = place.name;
        infowindowContent.children['place-address'].textContent = address;
        infowindow.open(map, marker);

        // console.log(infowindowContent.children['place-name'].textContent = address);

        console.log('B ' + place.name);

        var myLat = place.geometry.location.lat();
        var myLong = place.geometry.location.lng();
        var latLng = {lat: myLat, lng: myLong};

        console.log(latLng);

        var service = new google.maps.places.PlacesService(map);

        submitBtn.addEventListener('click', function getRadioOption(){

            var radioValue = $('input[name=type]:checked').val();

            console.log(radioValue);

            var apiKey = 'AIzaSyCyqxMkhc31hKFwW7etsYUkj4PoaO0nSoo'
            var placesNearByQuery = 'https://maps.googleapis.com/maps/api/place/textsearch/xml?query=' + radioValue + '+in+' + place.name + '&key=' + apiKey;

            console.log(placesNearByQuery);

            service.nearbySearch({
                location: latLng,
                radius: 1000,
                type: radioValue
            }, callback);

            map = new google.maps.Map(document.getElementById('map'), {
                center: latLng,
                zoom: 15,
                disableDefaultUI: true
            });

        }) /* /submitBtn */

        // console.log(address);

        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
                }
            }
        }

        // create markers for types
        function createMarker(place) {

            var placeLoc = place.geometry.location;

            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });

            // console.log(place);

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(place.name + '<br/>' + place.vicinity + '<br/>' + '<a href="">Get direction</a>');
                infowindow.open(map, this);
            });

        }

        function setupClickListener(id, types) {
            var radioButton = document.getElementById(id);
            radioButton.addEventListener('click', function() {
                autocomplete.setTypes(types);
                });
        }  

        setupClickListener('changetype-lodging', ['lodging']);
        setupClickListener('changetype-park', ['park']);
        setupClickListener('changetype-restaurant', ['restaurant']);

        directions();

    }); /* /autoComplete event listener */


} /* /initMap */

