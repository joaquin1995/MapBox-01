mapboxgl.accessToken = 'pk.eyJ1Ijoiam9hcXVpbjE5OTUiLCJhIjoiY2pwMDQ5ZjdrMDM0YzNqbG54NWZoOWxobSJ9.R03b-5kOB8QXfbiuyZWbGw';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-63.2918351, -17.7567898], // starting position
    zoom: 3 // starting zoom
});

let marker = '';
let bool = 0;
let cont = 0;
let latitudes = 0,longitudes = 0;

let geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
})
// Add geolocate control to the map.

geolocate.on('geolocate', function (e) {
    console.log(e.coords);
    let lat =  e.coords.latitude;
    let lng =  e.coords.longitude;
    console.log('lat',lat,'lng',lng);
    // origenDestino(lng,lat);
    // directions.setOrigin([lng, lat]);
    setTimeout(() => {
    origenDestino(lng,lat);
    }, 3000);
    get(lng,lat).
    then(res =>{
        console.log(res.features[0].place_name);
        
    })
    .catch(err => {
        console.log(err);
    })

});

map.addControl(geolocate);


map.addControl(new mapboxgl.NavigationControl());

map.on('click', function (e) {

    console.log(e.lngLat);
    const lng = e.lngLat.lng;
    const lat = e.lngLat.lat;
    console.log('lng', lng, 'lat', lat);
    if (cont === 0) {
        cont++;
    } else {
        marker.remove();
    }
    markers(lng, lat);
});

const markers = (lng, lat) => {

    marker = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map);
        get(lng,lat).
        then(res =>{
            console.log(res.features[0].place_name);
            
        })
        .catch(err => {
            console.log(err);
        })
        origenDestino(lng,lat);
}

// es-ES
let geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    placeholder: 'Buscar',
    marker: {
        color: '#82D0FC'
    },
});

geocoder.on('result', function (e) {
    console.log(e.result.center);
    const lng = e.result.center[0];
    const lat = e.result.center[1];
    console.log('lng', lng, 'lat', lat);
    setTimeout(() => {
        origenDestino(lng,lat);
    }, 3000); 
    get(lng,lat).
    then(res =>{
        console.log(res.features[0].place_name);
        
    })
    .catch(err => {
        console.log(err);
    })
   
});


document.getElementById('geocoder').appendChild(geocoder.onAdd(map));



let directions = new MapboxDirections({
    accessToken: 'pk.eyJ1Ijoiam9hcXVpbjE5OTUiLCJhIjoiY2pwMDQ5ZjdrMDM0YzNqbG54NWZoOWxobSJ9.R03b-5kOB8QXfbiuyZWbGw',
    unit: 'metric',
    profile: 'mapbox/cycling',
    interactive:false,
    // zoom:3,
    flyTo:false,
    controls:{
        inputs:false,
        instructions: false
    },
    alternatives: true,
    
  });
  // add to your mapboxgl map

  directions.on('route',function(e){
    console.log(e.route[0].distance/1000);
    console.log(e.route[0].duration/60);    
  });

const origenDestino =(lng,lat) => {

    if((longitudes !== lng) || (latitudes !== lat)){
        longitudes = lng;
        latitudes = lat;
        if(bool === 0){
            directions.setOrigin([longitudes, latitudes]);
            bool++;
        }  
        else{
            directions.setDestination([longitudes, latitudes]);
        }

    }
    // directions.setOrigin('Brockton Avenue, Toronto');
    // directions.setDestination([34, -90]);
    // directions.query();
}

map.addControl(directions);

const get = async (lng,lat)=>{

    const url = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=pk.eyJ1Ijoiam9hcXVpbjE5OTUiLCJhIjoiY2pwMDQ5ZjdrMDM0YzNqbG54NWZoOWxobSJ9.R03b-5kOB8QXfbiuyZWbGw`);
    const data = await url.json();
    // console.log(data);    
    return data;
}


