module.exports = ({ lon, lat }) =>
  `
  <html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <meta charset="utf-8" />
    <title>Circles</title>
    <style>
      /* Always set the map height explicitly to define the size of the div
       * element that contains the map. */
      #map {
        height: 100%;
      }
      /* Optional: Makes the sample page fill the window. */
      html,
      body {
        height: 100%;
        margin: 0;
        padding: 0;
      }
      a[href^="http://maps.google.com/maps"]{display:none !important}
      a[href^="https://maps.google.com/maps"]{display:none !important}

      .gmnoprint a, .gmnoprint span, .gm-style-cc {
          display:none;
      }
      .gmnoprint div {
          background:none !important;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      var map = null;
      var cityCircle = null;
      var marker = null;

      function initMap() {
        // Create the map.
          map = new google.maps.Map(document.getElementById("map"), {
          zoom: 11,
          center: { lat: ${lat}, lng: ${lon} },
          mapTypeId: "terrain",
          disableDefaultUI: true,
          gestureHandling: 'none',
          zoomControl: false,
          clickableIcons: false,
        });

        cityCircle = new google.maps.Circle({
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          map: map,
          center: { lat: ${lat}, lng: ${lon} },
          radius: 0
        });
        
        marker = new google.maps.Marker({
          position: { lat: ${lat}, lng: ${lon} },
          map: map,
          title: "You are here"
        });
      }

      function changeRadius(zoom = 15, radius = 0, lng, lat) {
        var center = { lat, lng };
        map.panTo(center);
        marker.setPosition(center);
        cityCircle.setCenter(center);
        cityCircle.setRadius(radius);
        map.setZoom(zoom);
      }
    </script>
    <script
      async
      defer
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCIen1q5qlBeRbLejD17UiNp15AtqbXZUw&callback=initMap"
    ></script>
  </body>
</html>

`;
