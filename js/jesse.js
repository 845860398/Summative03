







function initAutocomplete(){


    var input = document.getElementById('formInput');

    var acomplete = new google.maps.places.Autocomplete(input);
    // var mapDiv = $('#map');

    google.maps.event.addListener(acomplete, 'place_changed', function(){
      
        var place = acomplete.getPlace();
        // console.log(place.formatted_address);
        // console.log(place.url);
        console.log(place);

        var myLat = place.geometry.location.lat();
        console.log(myLat);

        var myLong = place.geometry.location.lng();
        console.log(myLong);

        var uluru = {lat: myLat, lng: myLong};

        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 8,
          center: uluru
        });

        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
 
        
    });
   
} /* /initAutocomplete */



