if (typeof whaste === 'undefined' || !whaste) {
    whaste = {};
}

// XXX - Mock
// whaste.getPlace = function(properties) {
//     if (Math.random() > 0.1) {
//         var place = {geometry : {
//                         location : {
//                            lat : -33.8628430,
//                            lng : 151.1952320
//                         }
//                      },
//                      icon : "http://maps.gstatic.com/mapfiles/place_api/icons/bar-71.png",
//                      id : "05bf6e9aa18b35f174f5076c348ce8e91e328aba",
//                      name : "Flying Fish Restaurant",
//                      opening_hours : {
//                         open_now : false
//                      },
//                      rating : 4.30,
//                      reference : "CoQBcwAAAMY0crP_AUzzZbQluYOlNslRtJ8R7jmh40p8mZqS8R1UW0ZNxSJiZgp8SoLSPotbufherQBbo_79NPcDZxJ382ZOgJxnyEGXpN2kkFt-SI3myTpk--4VroUiPvdnPriYsBWtX55F5C5VrBEYvobXjOnRfz2BlxVBEg3KWPZwUpelEhBgctmWBxWO44Aiamdr3dVqGhTdv2635iHM6jeLI0Nc57xJD_2TEQ",
//                      types : [ "bar", "restaurant", "food", "establishment" ],
//                      vicinity : "19-21 Pirrama Road, Pyrmont"
//                   }
//         properties.callback(place);
//     } else {
//         properties.callback();
//     }
// };
if(typeof Whaste === "undefined") {
        var Whaste = {};
      }

      Whaste.places = null;
      Whaste.currentParams = null;

      Whaste.getPlace = function(params) {
        if(Whaste.places === null) {
          Whaste.populatePlaces(params);
        } else {
          var callback = params.callback;
          Whaste.getPlace2(callback);
        }
      };

      Whaste.populatePlaces = function(params) {
        Whaste.queryAPI(params);
      };

      Whaste.getPlace2 = function(callback) {
        var o = Whaste.places.pop();
        callback(o);
      };

      Whaste.queryAPI = function (params) {
        var pyrmont = params.pyrmont;
        var map = params.map;

        var request = {
          location: pyrmont,
          radius: params.radius,
          types: [params.types]
        };

        var service = new google.maps.places.PlacesService(map);
        Whaste.currentParams = params;
        service.search(request, Whaste.internalCallback);
      }

      Whaste.internalCallback = function(results, status) {
        console.log(status);
        var params = Whaste.currentParams;
        if (status === google.maps.places.PlacesServiceStatus.OK) {

          var callback = params.callback;
          var places = [];

          if(!results || results.length < 3) {
            callback(null);
            return;
          }

          var done=[];
          for(var k=0;k<3;k++) {
            var r = parseInt(Math.random() * results.length);
            if(done.indexOf(r) != -1) {
              continue;
            }
            var o = results[r];
            places.push(o);
          }
          Whaste.places = places;
          Whaste.getPlace2(callback);
        } else {
          params.callback();
        }


      };

      Whaste.createMarker = function(place) {


        infowindow = new google.maps.InfoWindow();

        //console.log(place);
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
      };

(function() {

    // --- Paramas in file scope --- //
    var map, lat, lng;
    var noPlacesTemplate, placeTemplate, selectedTemplate, noMoreAttemptsTemplate;

    // --- Functions in file scope --- //
    var checkForPlace = function(e) {
        e.preventDefault();

        var showPlace_callback = function(place) {
            if (typeof place !== 'undefined' && place) {
                var context = {title: 'How about this place?', place: place, stars: {text: 'Going with the first suggestions?'}};
                var html = placeTemplate(context);
                $('#content').html(html);

            } else {
                var context = {title: 'No places available...'};
                var html = noPlacesTemplate(context);
                $('#content').html(html);
            }
        };

        // Mange the number of attempts using cookie
        var times = $.cookie('times');
        if (typeof times === 'undefined' || !times) {
            times = 0;
        }
        times++;
        $.cookie('times', times, { expires: 1, path: '/'});

        if (times <= 3) {
            lat = google.loader.ClientLocation.latitude;
            lng = google.loader.ClientLocation.longitude;

            var pyrmont = new google.maps.LatLng(lat, lng);
            map = new google.maps.Map(document.getElementById('map'), {
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: pyrmont,
                zoom: 15
            });

            var properties = {pyrmont: pyrmont, radius: 10000, types: ["bar", "restaurant", "food", "establishment"], map: map, callback: showPlace_callback};
            Whaste.getPlace(properties);

        } else {
            var context = {title: 'No more attempts...',
                            tweet: {text: encodeURIComponent("Don't know where to have lunch? Let Whaste choose for you"), url: 'http://www.whaste.com', via: 'whaste'}};
            var html = noMoreAttemptsTemplate(context);
            $('#content').html(html);
        }

        return false;
    };

    var selectPlace = function(e) {
        e.preventDefault();
        var context = {title: 'Awesome choice! Have a great lunch!',
                        tweet: {text: encodeURIComponent("I let @Whaste choose a lunch place for me. What will it choose for you?"), url: 'http://www.whaste.com'}};
        var html = selectedTemplate(context);
        $('#content').html(html);
        return false;
    };


    // --- Document Ready --- //
    $(document).ready(function() {

        google.maps.event.addDomListener(window, 'load');

        // Compile JS templates
        var noPlacesTemplateSource = $("#no-places-template").html();
        noPlacesTemplate = Handlebars.compile(noPlacesTemplateSource);

        var placeTemplateSource = $("#place-template").html();
        placeTemplate = Handlebars.compile(placeTemplateSource);

        var selectedTemplateSource = $("#selected-template").html();
        selectedTemplate = Handlebars.compile(selectedTemplateSource);

        var noMoreAttemptsTemplateSource = $("#no-more-attempts-template").html();
        noMoreAttemptsTemplate = Handlebars.compile(noMoreAttemptsTemplateSource);

        $('#content').on('click', '.js-get-place', checkForPlace);
        $('#content').on('click', '.js-select-place', selectPlace);

    });
})();
