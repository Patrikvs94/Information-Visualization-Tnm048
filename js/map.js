function showMap() {
    var mymap = L.map('mapid').setView([62.2, 17.55], 5);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoicGF0cmlrdnMiLCJhIjoiY2pzZDd4aDJhMHJmMDN6bWx1aHJpaGh4bCJ9.auJ5Pnug3A3ZXjkH92669g'
    }).addTo(mymap);  
}