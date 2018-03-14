
console.log('A');

$(document).ready(function(){



    var input = $('#formInput')[0];
    var submitBtn = $('#submitBtn')[0];

    var accom = $('#r1')[0];
    var parks = $('#r2')[0];
    var rest = $('#r3')[0];



submitBtn.addEventListener('click', function getRadioOption(){
    var radioValue = $('input[name=options]:checked').val();
    console.log(radioValue);
})

// console.log(radioValue);


function initMap(){

    var mapDiv = $('#map')[0];

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.8666, lng: 151.1958},
        zoom: 8
    });

    var acomplete = new google.maps.places.Autocomplete(input);

    google.maps.event.addListener(acomplete, 'place_changed', function(){

        var place = acomplete.getPlace();
        var myLat = place.geometry.location.lat();
        var myLong = place.geometry.location.lng();
        var uluru = {lat: myLat, lng: myLong};

        var request = {
            location: map.getCenter(),
            radius: '500',
            query:  'Google ' + place.name
        };

        console.log(request.query);

        var service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback);

        
        // console.log(place.formatted_address);
        // console.log(place.url);
        // console.log(place.name);
        // console.log(myLat);
        // console.log(myLong);

        // var map = new google.maps.Map(document.getElementById('map'), {
        //   zoom: 8,
        //   center: uluru
        // });

        var marker = new google.maps.Marker({
          position: uluru,
          map: map,
          zoom: 8
        });
 
        
    });
   
} /* /initMap */

function callback(results, status) {
    console.log('z');
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    var marker = new google.maps.Marker({
      map: map,
      position: initMap.uluru,
      place: {
        placeId: results[0].place_id,
        location: results[0].geometry.location
      }
    });
  }
}

// initMap();

}); /* /$document.ready */