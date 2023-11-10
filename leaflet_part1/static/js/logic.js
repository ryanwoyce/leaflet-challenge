let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(queryUrl).then(function(data) {
    console.log(data)

    let quakeMarkers = [];

    // SETS COLOR BAR
        function getColor(c) {
        return c >= 90 ? "#feebe2" :
               c >= 70 ? "#fcc5c0" :
               c >= 50 ? "#fa9fb5" :
               c >= 30 ? "#f768a1" :
               c >= 10 ? "#c51b8a" :
                        "#7a0177" ;
    };

    // FOR LOOP TO PLOT POINTS
    for(let i=0; i<data.features.length; i++) {
        let location = data.features[i].geometry;
        let coords = [location.coordinates[1], location.coordinates[0]]
        // FILL ARRAY WITH CIRCLE POINTS
        quakeMarkers.push(
            L.circleMarker(coords, {
                stroke: true,
                weight: 0.5,
                opacity: 1,
                fillOpacity: 0.9,
                color: "#000000",
                fillColor: getColor(location.coordinates[2]),
                radius: data.features[i].properties.mag*4
            // CREATE POPUP INFO FOR MARKERS
            }).bindPopup("<strong>Location: " + data.features[i].properties.place + "</strong><br />Coordinates: (" + (location.coordinates[1]).toFixed(2)
                         + ", " + (location.coordinates[0]).toFixed(2) + ")<br />Magnitude: " + (data.features[i].properties.mag).toFixed(2) + "<br />Depth: "
                         + location.coordinates[2])
        );
    }
    
    // OVERLAY LAYER
    let markers = L.layerGroup(quakeMarkers);
    
    // BASE LAYER
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    
    // BASE LAYER
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    let baseMaps = {
        "street map": street,
        "topographic map": topo
    };

    let overlayMaps = {
        Earthquakes: markers
    };

    // CREATE MAP
    let map = L.map("map", {
        center: [48.3, -124.7],
        zoom: 4,
        layers: [street, markers]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

    // CREATE LEGEND
    let legend = L.control({position: "bottomright"});

    legend.onAdd = function(map) {
        let div = L.DomUtil.create("div", "info legend");
        labelGroup = ["<10", "10-30", "30-50", "50-70", "70-90", "90+"],
        categories = [0, 10, 30, 50, 70, 90],
        labels = [];

        // PUSH LABEL INFO TO ARRAY
        for(let x=0; x<categories.length; x++) {
            div.innerHTML +=
            labels.push(
                '<li style=\"background-color:' + getColor(categories[x] + 1) + '\"></i>' + (labelGroup[x] ? labelGroup[x] : '+'));
        }
  
        div.innerHTML = '<ul style="list-style-type: none;">' + labels.join('<br>') + "</ul>";
        //div.innerHTML = labels.join('<br>');
        return div;
    };
    legend.addTo(map)
});