if (typeof whaste === 'undefined' || !whaste) {
    whaste = {};
}

// Mock
whaste.getPlace = function(properties) {
    if (Math.random() > 0.1) {
        var place = {};
        place.name = 'some place name ' + Math.random();
        properties.callback(place);
    } else {
        properties.callback();
    }
};

(function() {

    // --- Document Ready --- //
    $(document).ready(function() {

    var times = 0;
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

        //FIXME Check cookie
        times++;
        if (times <= 3) {
            var properties = {distance: 500, callback: showPlace_callback};
            whaste.getPlace(properties);

        } else {
            var context = {title: 'No more attempts...'};
            var html = noMoreAttemptsTemplate(context);
            $('#content').html(html);
        }

        return false;
    };

    var selectPlace = function(e) {
        e.preventDefault();
        var context = {title: "Awesome choice! Have a great lunch!"};
        var html = selectedTemplate(context);
        $('#content').html(html);
        return false;
    };

        // XXX - crappy test stuff
        var times = $.cookie('times');
        console.log('times before:' + times);
        if (typeof times === 'undefined' || !times) {
            $.cookie('times', 1, { expires: 1, path: '/'});
        } else {
            times++;
            $.cookie('times', times, { expires: 1, path: '/'});
        }
        console.log('times after:' + times);

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
