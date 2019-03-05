var info = L.control();

//Can only be ran ater page has been loaded
function initializeMap () {
    mymap = L.map('mapid').setView([62.2, 17.55], 5);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.light',
        accessToken: 'pk.eyJ1IjoicGF0cmlrdnMiLCJhIjoiY2pzZDd4aDJhMHJmMDN6bWx1aHJpaGh4bCJ9.auJ5Pnug3A3ZXjkH92669g'
    }).addTo(mymap);

    info.addTo(mymap);
}

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

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Sweden Population Density</h4>' +  (props ?
        '<b>' + props.KNNAMN + '</b><br />' + (props.popDensity[selectedYear]).toFixed(2) + ' people / mi<sup>2</sup>'
        : 'Hover over a state');
};


function style(feature) {
    return {
        fillColor: getColor(feature.properties.popDensity[selectedYear]),
        weight: 1.2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function markFeature(e) {
    var layer = e.target;
    if (!e.target.hasOwnProperty("marked")) {
        e.target.marked = true;
        layer.setStyle({
            weight: 1.2,
            color: 'white',
            fillColor: '#3473d8',
            dashArray: '3',
            fillOpacity: 0.7
        });
    } else {
        if (e.target.marked == true) {
            e.target.marked = false;
            geojson.resetStyle(e.target);
        } else {
            e.target.marked = true;
            layer.setStyle({
                weight: 1.2,
                color: 'white',
                fillColor: '#3473d8',
                dashArray: '3',
                fillOpacity: 0.7
            });
        }
    }

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    var layer = e.target;

    if (!e.target.hasOwnProperty("marked")) {
        geojson.resetStyle(e.target);
    } else {
        if (e.target.marked == true)
            layer.setStyle({
                weight: 1.2,
                color: 'white',
                fillColor: '#3473d8',
                dashArray: '3',
                fillOpacity: 0.7
            });
        else {
            geojson.resetStyle(e.target);
        }
    }

    info.update();
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: markFeature
    });
}

function restyleLayer(selectedYear) {

    geojson.eachLayer(function(featuredInstancelayer) {
        if(featuredInstancelayer != null) {
            //var propertyValue = featureInstanceLayer.feature.properties.popDensity[selectedYear];
            console.log(featuredInstancelayer.feature);
            var theFeature = featuredInstanceLayer.feature;
            var theStyle = style(theFeature);

            featuredInstanceLayer.setStyle(theStyle);
        }
    });
}

function addTopoToMap(topoData) {
    geojson = L.geoJson(topojson.feature(topoData, topoData.objects.kommuner), {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(mymap);
}