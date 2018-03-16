

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


        marker.addListener('click', function(){
            var address = '';

           
            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }// /if

        
            console.log(place.address_components);

            infowindowContent.children['place-icon'].src = place.icon;
            infowindowContent.children['place-name'].textContent = place.name;
            infowindowContent.children['place-address'].textContent = address;
            infowindow.open(map, marker);
        });
        // var address = '';
       
        // if (place.address_components) {
        //     address = [
        //         (place.address_components[0] && place.address_components[0].short_name || ''),
        //         (place.address_components[1] && place.address_components[1].short_name || ''),
        //         (place.address_components[2] && place.address_components[2].short_name || '')
        //     ].join(' ');
        // }// /if

        // infowindowContent.children['place-icon'].src = place.icon;
        // infowindowContent.children['place-name'].textContent = place.name;
        // infowindowContent.children['place-address'].textContent = address;
        // infowindow.open(map, marker);

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
                position: place.geometry.location
            }); // /marker

            // click event on markers to show info
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(place.name + '<br/>' + place.vicinity + '<br/>' + '<a href="">Get direction</a>');
                infowindow.open(map, this);
            }); //  /info click event

        }// /createMarker

    

     }); /* /autoComplete event listener */


} /* /initMap */

