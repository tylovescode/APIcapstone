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
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
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
      // $("#weather").html("<h2>The current temperature in "+weather.city+" is "+weather.temp+"&deg;"+weather.units.temp+".</h2><p>The sun will set at "+weather.sunset+".</p>");
      $("#weather").html("<h2>In "+weather.city+", it is currently "+weather.text+" and "+weather.temp+"&deg;"+weather.units.temp+".</h2>");
      $('#going-on').html("<h3>Here's what is going on near "+weather.city+":</h3>")
    },
    error: function(error) {
      $("#weather").html('<p>'+error+'</p>');
    }
  });

//Ticketmaster
$.ajax({
  type:"GET",
  url:"https://app.ticketmaster.com/discovery/v2/events.json?size=10&apikey=ZiVpCBhveUAxqrDFzahcvahnPLMJxfFS&sort=distance,asc&latlong="+longitude+","+latitude,
  async:true,
  dataType: "json",
  success: function(json) {
              //if another location is searched for, clear event results from old location
              $('#events').empty();  
              console.log(json)
              console.log(json._embedded.events[0])
              console.log(json._embedded.events[0]._embedded.venues[0].location)
              $.each(json._embedded.events, function(index, value) {
              // $('#going-on').html("<h3>Here's what is going on near "+address+":</h3>")
              $('#events').append("<h4>"+value.name+", "+value._embedded.venues[0].name+" ("+value._embedded.venues[0].distance+" miles away).</h4>")
              })
            },
  error: function(xhr, status, err) {
           }
}); 

//Foursquare
$.ajax({
  type:"GET",
  url:"https://api.foursquare.com/v2/venues/explore?ll="+longitude+","+latitude+"&limit=10&client_id=DQI3FD5H5K2LDJ04NN2VL1VWKQDGINPFKSMVUDU4AUY4ZGIE&client_secret=ZGWFZWFZIM53TGVLQXFFCACRLPTDQE4HEHC10TGBEZSDFMSJ&v=20171228",
  async:true,
  dataType: "json",
  success: function(json) {
              //if another location is searched for, clear event results from old location
              $('#food').empty();  
              console.log("Foursquare running")
              console.log(json)
              console.log(json.response.groups[0].items[0].venue.name)
              // console.log(json._embedded.events[0])
              $.each(json.response.groups[0].items, function(index, value) {
              $('#food').append("<h4>"+value.venue.name+"</h4>")
              })
            },
  error: function(xhr, status, err) {
           }
});

};
    
