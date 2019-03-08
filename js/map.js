//var info = L.control();
var clicked_municipality = [];

//Can only be ran after the page has been loaded
function initializeMap () {
    mymap = L.map('mapid').setView([62.2, 18], 5);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.light',
        accessToken: 'pk.eyJ1IjoicGF0cmlrdnMiLCJhIjoiY2pzZDd4aDJhMHJmMDN6bWx1aHJpaGh4bCJ9.auJ5Pnug3A3ZXjkH92669g'
    }).addTo(mymap);

    update_info();
    add_legend();
}

function getColor(d) {
    return d > 4000 ? '#005a32' :
        d > 2000  ? '#238b45' :
        d > 600  ? '#41ab5d' :
        d > 200  ? '#74c476' :
        d > 70   ? '#a1d99b' :
        d > 20   ? '#c7e9c0' :
        d > 10 ? '#edf8e9' :
                    '#f7fcf5';
}


//Method that we will use to update the control based on feature properties passed
function update_info(props) {
    document.getElementById("info").innerHTML = '<h4>Sweden Population Density</h4>' +  (props ?
        '<b>' + props.KNNAMN + ' </b><br />' + (props.popDensity[selectedYear]).toFixed(2) + ' people / km<sup>2</sup>' +
        '<br />' + (props.popDensityWomen[selectedYear]).toFixed(2) + ' women / km<sup>2</sup>' +
        '<br />' + (props.popDensityMen[selectedYear]).toFixed(2) + ' men / km<sup>2</sup>'
        : 'Hover over a municipality');
};

//Method to add code to the html div legend
function add_legend() {
    grades = [0, 10, 20, 70, 200, 600, 2000, 4000],
    labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        document.getElementById("legend").innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
}

//Method with the standard style for each municipality
function style(feature) {
    return {
        fillColor: getColor(feature.properties.popDensity[selectedYear]),
        weight: 0.5,
        opacity: 0.7,
        color: '#666',
        dashArray: '3',
        fillOpacity: 1
    };
}

//Method with style when hovering over a municipality
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

    update_info(layer.feature.properties);
}

//Method with style for clicking at a municipality
function markFeature(e) {
    var layer = e.target;

    //If the max limit of municipalities already are marked and the user tries to mark a new municipality
    if (clicked_municipality.length == 5 && e.target.marked != true) {
        return;
    } 

    if (!e.target.hasOwnProperty("marked")) {
        e.target.marked = true;
        var colorIndex = getColorIndex()
        layer.feature.properties.colorIndex = colorIndex;
        clicked_municipality.push(layer.feature.properties);
        layer.setStyle({
            weight: 1.2,
            color: 'white',
            fillColor: colors[colorIndex],
            dashArray: '3',
            fillOpacity: 0.7
        });
    } 
    else {
        if (e.target.marked == true) {
            e.target.marked = false;

            if(layer.feature.properties.colorIndex != null)
                clearColorIndex(layer.feature.properties.colorIndex);

            var index_municipality = clicked_municipality.indexOf(layer.feature.properties); //Check which index to delete from array
            clicked_municipality.splice(index_municipality, 1); //Splice instead of delete, so that no "holes" in the array will appear
            geojson.resetStyle(e.target);
        } else {
            e.target.marked = true;
            var colorIndex = getColorIndex()
            layer.feature.properties.colorIndex = colorIndex;
            clicked_municipality.push(layer.feature.properties);
            layer.setStyle({
                weight: 1.2,
                color: 'white',
                fillColor: colors[colorIndex],
                dashArray: '3',
                fillOpacity: 0.7
            });
        }
    }
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    update_info(layer.feature.properties);
    setChartData();
    initializeChart();
}

//Method to reset style when not hovering or unclicking a municipality
function resetHighlight(e) {
    var layer = e.target;

    if (!e.target.hasOwnProperty("marked")) {
        geojson.resetStyle(e.target);
    } else {
        if (e.target.marked == true)
            layer.setStyle({
                weight: 1.2,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            });
        else {
            geojson.resetStyle(e.target);
        }
    }
    update_info();
}

//Method used for setting the eventlisteners
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: markFeature
    });
}

function restyleLayer(selectedYear) {
	geojson.eachLayer(function(featuredInstancelayer) {
		if(!featuredInstancelayer.hasOwnProperty("marked")) {
			if(featuredInstancelayer != null) {
				var theLayer = featuredInstancelayer;
				theLayer.setStyle(style(theLayer.feature));
			}
		}
	});
}

function addTopoToMap(topoData) {
    geojson = L.geoJson(topojson.feature(topoData, topoData.objects.kommuner), {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(mymap);
}