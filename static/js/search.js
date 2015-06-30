$(function() {

    // Submit search on submit
    $('#search-form').on('submit', function(event){
        event.preventDefault();
        $('.intro-gif').css('display', 'none');        
        wxSearch();
    });

    // getJSON for searching
    function wxSearch() {
        var apiURL = "http://api.openweathermap.org/data/2.5/weather?q=";
        var queryString = $('#id_search_location').val();
        var queryURL = apiURL + queryString;

        // Render data retrieved from API into HTML template
        $.getJSON(queryURL, function(data) {
            $('#lat').html(data.coord.lat);
            $('#lon').html(data.coord.lon);
            $('#loc_name').html(data.name);
            $('#country').html(data.sys.country);
            // Call Unixtime conversion function
            convertUnixtime(data);
            $('#con').html(data.weather[0].description);
            $('#temp-far').html(((data.main.temp * (9/5)) - 459.67).toFixed(1) + "ºF");
            $('#temp-cel').html((data.main.temp - 273.15).toFixed(1) + "ºC");
            $('#hum').html((data.main.humidity).toFixed(2) + "%");
            $('#wind').html((data.wind.speed * 2.23693629).toFixed(2) + "Mph");
            convertWindDirection(data);
            $('#pres').html(data.main.pressure.toFixed(2) + "mb");        
            // Call function to change background based on reported conditions
            changeBackground(data);
        });
    }

    // Change background based on reported conditions
    function changeBackground(data) {
        var imgURL = "";
        var conditionCode = data.weather[0].id;
        console.log(conditionCode);

        // Cases for different condition codes to set differing background URLs
        switch (conditionCode) {
            case 200:
            case 201:
            case 202:
            case 210:
            case 211:
            case 212:
            case 221:
            case 230:
            case 231:
            case 232:
                imgURL = 'url("./static/imgs/thunderstorm.jpg")';
                break;
            case 300:
            case 301:
            case 302:
            case 310:
            case 311:
            case 312:
            case 313:
            case 314:
            case 321:
            case 500:
            case 520:
                imgURL = 'url("./static/imgs/rain-lite.jpg")';
                break;
            case 501:
            case 521:
                imgURL = 'url("./static/imgs/rain-med.jpg")';
                break;
            case 502:
            case 503:
            case 504:
            case 522:
                imgURL = 'url("./static/imgs/heavy_rain.jpg")';
                break; 
            case 511:
            case 611:
            case 612:
                imgURL = 'url("./static/imgs/freezing-rain.jpg")';
                break;
            case 600:
            case 620:
                imgURL = 'url("./static/imgs/light-snow.jpg")';
                break;
            case 601:
            case 602:
            case 615:
            case 616:
            case 621:
            case 622:
                imgURL = 'url("./static/imgs/heavy-snow.jpg")';
                break;
            case 701:
            case 741:
                imgURL = 'url("./static/imgs/dense-fog.jpg")';
                break;
            case 711:
                imgURL = 'url("./static/imgs/smoky-sky.jpg")';
                break;
            case 721:
                imgURL = 'url("./static/imgs/haze.jpg")';
                break;
            case 731:
            case 751:
            case 761:
                imgURL = 'url("./static/imgs/sand.jpg")';
                break; 
            case 800:
                imgURL = 'url("./static/imgs/clear-sky.jpg")';
                break;
            case 801:
                imgURL = 'url("./static/imgs/few-clouds.jpg")';
                break;
            case 802:
                imgURL = 'url("./static/imgs/broken-clouds.jpg")';
                break;
            case 804:
                imgURL = 'url("./static/imgs/overcast.jpg")';
                break;
            default:
                return false;    
        }
        // Call function to update css in the document body
        updateCSS(imgURL);
    }

    // Updates background of the page body to reflect reported weather condition codes
    function updateCSS(imgURL) {
        var changes = imgURL + ' no-repeat center center fixed';
        $('body').css('background', changes);
    }    

    function convertUnixtime(data) {
        // Create a new javascript Date object based on the timestamp
        // multiply by 1000 so that the argument is in milliseconds, not seconds
        var unixTimeConverted = new Date(data.dt * 1000);      
        $('#datetime').html(unixTimeConverted);
        var localTime = $("span:contains('GMT-0400')").text().replace('GMT-0400', '');
        $('#datetime').text(localTime);          
    }

    // Convert wind direction to 16 point cardinal directions
    function convertWindDirection(data) {
        var degrees = data.wind.deg;
        var val = Math.round((((degrees/22.5) + 0.5)) % 16);
        var directions = [
            'North', 
            'North-Northeast', 
            'Northeast', 
            'East-Northeast', 
            'East', 
            'East-Southeast', 
            'Southeast', 
            'South-Southeast', 
            'South', 
            'South-Southwest', 
            'Southwest', 
            'West-Southwest', 
            'West', 
            'West-Northwest', 
            'Northwest', 
            'North-Northwest'
            ];
        var windDir = (directions[val]);
        $('#wind-dir').html(windDir + ' (' + degrees + ')º');        
    }    

    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

});