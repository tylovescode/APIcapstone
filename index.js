//Google Maps
function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    //enter starting location
    center: {lat: 34.7698, lng: -84.9702},
    zoom: 13,
    mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    console.log("Searched place formatted",places[0].formatted_address);
    // v3.1.0
    console.log(places[0]);
    var service = new google.maps.places.PlacesService(map);
    var latitude=places[0].geometry.viewport.b.b;
    var longitude=places[0].geometry.viewport.f.b;
    console.log(places)

    service.nearbySearch({
      location: {lat: latitude, lng: longitude},
      radius: 500,
    }, callback);
    function callback(results, status) {
    console.log(results);
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        console.log(results[i]);
        // createMarker(results[i]);
      }
    }
  }

useLocation(places[0].formatted_address, latitude, longitude, map);

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    // places.forEach(function(place) {
    //   if (!place.geometry) {
    //     console.log("Returned place contains no geometry");
    //     return;
    //   }
    //   var icon = {
    //     url: place.icon,
    //     size: new google.maps.Size(71, 71),
    //     origin: new google.maps.Point(0, 0),
    //     anchor: new google.maps.Point(17, 34),
    //     scaledSize: new google.maps.Size(25, 25)
    //   };

    //   // Create a marker for each place.
    //   markers.push(new google.maps.Marker({
    //     map: map,
    //     icon: icon,
    //     title: place.name,
    //     position: place.geometry.location
    //   }));

    //   if (place.geometry.viewport) {
    //     // Only geocodes have viewport.
    //     bounds.union(place.geometry.viewport);
    //   } else {
    //     bounds.extend(place.geometry.location);
    //   }
    // });
    map.fitBounds(bounds);
  });
}

function useLocation(address, latitude, longitude) {
  //Simple Weather  
  $.simpleWeather({
    location: address,
    woeid: '',
    unit: 'f',
    success: function(weather) {
      console.log(weather)
      $("#weather").html("<h2>The current temperature in "+weather.city+" is "+weather.temp+"&deg;"+weather.units.temp+".</h2><p>The sun will set at "+weather.sunset+".</p>");
    },
    error: function(error) {
      $("#weather").html('<p>'+error+'</p>');
    }
  });
//   $.ajax({
//     url:"https://api.yelp.com/v3/businesses/search?location=07755&term=pizza",
//     type:"GET",
//     dataType:"jsonp",
//     crossDomain:true,
//     headers:{
//       "Authorization":"Bearer Fq-Kom1O4EIrGX-vR5JEfeeqdRnbeONdbMGPB6wg0uxdwSIwYoTKFeQQ-HYf0rjIGfGnqSPeDmBlxdFD32wrvqprPikPLnr8yRI-AzbttFd0Gz_lmdghqpALMx84WnYx"
//     },
//     success:function(result) {
//   console.log(result)
// },error:function(error){
//   console.log(error)
// }
//   })

//Ticketmaster
$.ajax({
  type:"GET",
  url:"https://app.ticketmaster.com/discovery/v2/events.json?apikey=ZiVpCBhveUAxqrDFzahcvahnPLMJxfFS&latlong="+longitude+","+latitude,
  async:true,
  dataType: "json",
  size: 10,
  success: function(json) {
              console.log(json)
              console.log(json._embedded.events[0])
              $.each(json._embedded.events, function(index, value) {
              $('#events').append("<h4>"+value.name+"</h4>")
              })
var locations = [
      ['Bondi Beach', -33.890542, 151.274856, 4],
      ['Coogee Beach', -33.923036, 151.259052, 5],
      ['Cronulla Beach', -34.028249, 151.157507, 3],
      ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
      ['Maroubra Beach', -33.950198, 151.259302, 1]
    ];

    

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) {  
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
        }
      })(marker, i));
    }
  
              //$("#events").html(`${json._embedded.events[0]}`);
              // Parse the response.
              // Do other things.
           },
  error: function(xhr, status, err) {
              // This time, we do not end up here!
           }
});    

};    