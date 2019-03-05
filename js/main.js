$(document).ready(function() {
    initializeMap();
    initializeChart();
    getData().then(addTopoToMap);
});