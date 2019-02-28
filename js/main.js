$(document).ready(function() {
    initializeMap();
    getData().then(addTopoToMap);
});