if (typeof whaste === 'undefined' || !whaste) {
    whaste = {};
}

// Mock
whaste.getPlace = function(properties) {
    if (Math.random() > 0.1) {
        var place = {geometry : {
                        location : {
                           lat : -33.8628430,
                           lng : 151.1952320
                        }
                     },
                     icon : "http://maps.gstatic.com/mapfiles/place_api/icons/bar-71.png",
                     id : "05bf6e9aa18b35f174f5076c348ce8e91e328aba",
                     name : "Flying Fish Restaurant",
                     opening_hours : {
                        open_now : false
                     },
                     rating : 4.30,
                     reference : "CoQBcwAAAMY0crP_AUzzZbQluYOlNslRtJ8R7jmh40p8mZqS8R1UW0ZNxSJiZgp8SoLSPotbufherQBbo_79NPcDZxJ382ZOgJxnyEGXpN2kkFt-SI3myTpk--4VroUiPvdnPriYsBWtX55F5C5VrBEYvobXjOnRfz2BlxVBEg3KWPZwUpelEhBgctmWBxWO44Aiamdr3dVqGhTdv2635iHM6jeLI0Nc57xJD_2TEQ",
                     types : [ "bar", "restaurant", "food", "establishment" ],
                     vicinity : "19-21 Pirrama Road, Pyrmont"
                  }
        properties.callback(place);
    } else {
        properties.callback();
    }
};

(function() {

    // --- Document Ready --- //
    $(document).ready(function() {

    var checkForPlace = function(e) {
        e.preventDefault();

        var showPlace_callback = function(place) {
            if (typeof place !== 'undefined' && place) {
                var context = {title: 'What about this place?', place: place};
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
            var properties = {distance: 500, callback: showPlace_callback};
            whaste.getPlace(properties);

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

        var noPlacesTemplateSource = $("#no-places-template").html();
        var noPlacesTemplate = Handlebars.compile(noPlacesTemplateSource);

        var placeTemplateSource = $("#place-template").html();
        var placeTemplate = Handlebars.compile(placeTemplateSource);

        var selectedTemplateSource = $("#selected-template").html();
        var selectedTemplate = Handlebars.compile(selectedTemplateSource);

        var noMoreAttemptsTemplateSource = $("#no-more-attempts-template").html();
        var noMoreAttemptsTemplate = Handlebars.compile(noMoreAttemptsTemplateSource);

        $('#content').on('click', '.js-get-place', checkForPlace);
        $('#content').on('click', '.js-select-place', selectPlace);

    });
})();
