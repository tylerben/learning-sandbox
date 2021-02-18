import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
// import the mapbox styles
// alternatively can use a link tag in the head of public/index.html
// see https://docs.mapbox.com/mapbox-gl-js/api/
import "mapbox-gl/dist/mapbox-gl.css";

// Grab the access token from your Mapbox account
// I typically like to store sensitive things like this
// in a .env file
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const App = () => {
  const mapContainer = useRef();

  // this is where all of our map logic is going to live
  // adding the empty dependency array ensures that the map
  // is only rendered once
  useEffect(() => {
    // create the map and configure it
    // check out the API reference for more options
    // https://docs.mapbox.com/mapbox-gl-js/api/map/
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v11",
      // center: [-110.903982, 38.020403],
      center: [-120.0443, 38.4926],
      zoom: 14,
      // pitch: 60,
    });

    // only want to work with the map after it has fully loaded
    map.on("load", () => {
      // map.addSource("mapbox-dem", {
      //   type: "raster-dem",
      //   url: "mapbox://mapbox.mapbox-terrain-dem-v1",
      //   tileSize: 512,
      //   maxZoom: 16,
      // });
      // map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
      // map.addLayer({
      //   id: "sky",
      //   type: "sky",
      //   paint: {
      //     "sky-type": "atmosphere",
      //     "sky-atmosphere-sun": [0.0, 90.0],
      //     "sky-atmosphere-sun-intensity": 15,
      //   },
      // });
      map.addSource("slope_angle", {
        type: "raster",
        // tiles: ["https://caltopo.com/tile/sf/{z}/{x}/{y}@2x.png"],
        url: "https://tiles.nst.guide/slope-angle-png/tile.json",
        tileSize: 512,
      });
      map.addLayer({
        id: "cal-topo-slope-angle",
        source: "slope_angle",
        "source-layer": "slope_angle",
        type: "raster",
        paint: {
          "raster-opacity": 0.5,
        },
      });
    });

    // cleanup function to remove map on unmount
    return () => map.remove();
  }, []);

  return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />;
};

export default App;
