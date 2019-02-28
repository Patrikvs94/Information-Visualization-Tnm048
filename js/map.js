$( document ).ready(function() {
    var mymap = L.map('mapid').setView([62.2, 17.55], 5);
    // Municipality data from https://gist.github.com/miroli/4280679f81d0006e3142
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.light',
        accessToken: 'pk.eyJ1IjoicGF0cmlrdnMiLCJhIjoiY2pzZDd4aDJhMHJmMDN6bWx1aHJpaGh4bCJ9.auJ5Pnug3A3ZXjkH92669g'
    }).addTo(mymap);  

    //Needed to prevent error messages in the console when readin data from json file
    $.ajaxSetup({beforeSend: function(xhr){
        if (xhr.overrideMimeType)
        xhr.overrideMimeType("application/json");
    }
    });

    function getColor(d) {
        return d > 1000 ? '#800026' :
            d > 240  ? '#BD0026' :
            d > 120  ? '#E31A1C' :
            d > 60  ? '#FC4E2A' :
            d > 30   ? '#FD8D3C' :
            d > 10   ? '#FEB24C' :
            d > 5   ? '#FED976' :
                        '#FFEDA0';
    }

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.LANDAREAKM),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    function highlightFeature(e) {
        var layer = e.target;
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
        });
    }

    $.getJSON("kommun.json", function(data) {
        geojson = L.geoJson(topojson.feature(data, data.objects.kommuner), {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(mymap);
    });

});