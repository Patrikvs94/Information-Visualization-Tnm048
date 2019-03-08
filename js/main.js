$(document).ready(function() {
    initializeMap();
    //initializeChart();
    getData().then(addTopoToMap);
    document.getElementById("searchForm").onsubmit = function() {searchLayer(document.getElementById("searchText").value)};
});