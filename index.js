function hideContent() {
    $('#weather-box').hide();
    $('#content-box').hide();
    $('#map-box').hide();
}

function showContent() {
    $('#weather-box').show();
    $('#content-box').show();
    $('#map-box').show();
    $('.background-image').hide();
    $('#another').html('Search another destination');
    
}

function initAutocomplete() {

    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    var markers = [];

    searchBox.addListener('places_changed', function() {
        $(window).scrollTop(0);
        $('#pac-input').empty();
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            mapTypeId: 'roadmap'
        });
        var places = searchBox.getPlaces();
        console.log("Searched place formatted", places[0].formatted_address);
        console.log(places[0]);
        var service = new google.maps.places.PlacesService(map);
        var latitude = places[0].geometry.viewport.b.b;
        var longitude = places[0].geometry.viewport.f.b;
        var fullLocation = (places[0].formatted_address).split(", ");
        console.log(fullLocation);
        var cityname = fullLocation[0];
        var statename = fullLocation[1];
        console.log(places)

        service.nearbySearch({
            location: {
                lat: latitude,
                lng: longitude
            },
            radius: 500,
        }, callback);

        function callback(results, status) {
            console.log(results);
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    console.log(results[i]);
                }
            }
        }

        useLocation(places[0].formatted_address, latitude, longitude, cityname, statename);
        showContent();
        if (places.length == 0) {
            return;
        }

        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

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

            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {

                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}

function useLocation(address, latitude, longitude, cityname, statename, zipcode) {

    $.ajax({
        type: "GET",
        url: "https://us-zipcode.api.smartystreets.com/lookup?auth-id=5a5ea10f-a1ff-d560-ca76-c80cb84d48d7&auth-token=q6PUIwSuFx4zbfnKIxZR&city=" + cityname + "&state=" + statename,
        async: true,
        dataType: "json",
        success: function(json) {
            console.log(json)
            var zipcode = json[0].zipcodes[0].zipcode;

    $.ajax({
        type: "GET",
        url: "https://app.ticketmaster.com/discovery/v2/events.json?size=10&apikey=ZiVpCBhveUAxqrDFzahcvahnPLMJxfFS&includePast=no&sort=date,asc&city=" + cityname,
        async: true,
        dataType: "json",
        success: function(json) {
            $('#events').empty();
            console.log(json.page)

            if (json.page.totalPages === 0) {
                $('#events').empty();
                $('#events').append("<h3>There are currently no events listed for " + cityname)
            } else {
                $.each(json._embedded.events, function(index, value) {
                    $('#events').append("<h4><a href=" + value.url + " target='_blank'>" + value.name + "</a><br>" + value.dates.start.localDate + " at " + value._embedded.venues[0].name + "</h4>")
                })
            }

        },
        error: function(xhr, status, err) {}
    });
    console.log(json[0].zipcodes[0].zipcode);
    console.log(zipcode);
},
        error: function(xhr, status, err) {}
});

    $.simpleWeather({
        location: address,
        woeid: '',
        unit: 'f',
        success: function(weather) {
            console.log(weather)
            $('#forecast').empty();
            $("#weather").html("<h2>Current " + weather.city + " Weather: " + weather.text + ", " + weather.temp + "&deg;" + weather.units.temp + ".</h2>");
            $.each(weather.forecast, function(index, value) {
                if (index == 5) {
                    return false;
                }
                $('#forecast').append("<h4>" + value.day + " <img src=" + value.thumbnail + "> " + value.text + ", high of " + value.high + "&deg;, low of " + value.low + "&deg;</h4>")
            })
            $('#going-on').html("<h2>Here are some events near " + weather.city + ":</h2>")
            $('#food-list').html("<h2>Here are some top rated restaurants near " + weather.city + ":</h2>")
        },
        error: function(error) {
            $("#weather").html('<p>' + error + '</p>');
        }
    });

    $.ajax({
        type: "GET",
        url: "https://api.foursquare.com/v2/venues/explore?ll=" + longitude + "," + latitude + "&limit=10&section=food&client_id=DQI3FD5H5K2LDJ04NN2VL1VWKQDGINPFKSMVUDU4AUY4ZGIE&client_secret=ZGWFZWFZIM53TGVLQXFFCACRLPTDQE4HEHC10TGBEZSDFMSJ&v=20171228",
        // url: "https://api.foursquare.com/v2/venues/explore?near=" + zipcode + "&limit=10&section=food&client_id=DQI3FD5H5K2LDJ04NN2VL1VWKQDGINPFKSMVUDU4AUY4ZGIE&client_secret=ZGWFZWFZIM53TGVLQXFFCACRLPTDQE4HEHC10TGBEZSDFMSJ&v=20171228",
        async: true,
        dataType: "json",
        success: function(json) {
            $('#food').empty();
            console.log("Foursquare running")
            console.log(json)
            console.log(json.response.groups[0].items[0].venue.name)
            $.each(json.response.groups[0].items, function(index, value) {
                var address = value.venue.location.address
                var city = value.venue.location.city
                if (value.venue.url === undefined) {
                    var link = value.venue.name
                } else {
                    var link = "<a href=" + value.venue.url + " target='_blank'>" + value.venue.name + "</a>"
                }
                if (!city && !address) {
                    $('#food').append("<h4>" + link + "<br>Rating:" + value.venue.rating + "</h4>")
                } else {
                    $('#food').append("<h4>" + link + "<br>Rating:" + value.venue.rating + " | " + address + ", " + city + "</h4>")
                }
            })
        },
        error: function(xhr, status, err) {}
    });

};
hideContent();
