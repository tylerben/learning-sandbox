import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import SnotelSites from "./lcc_snotel_sites.json";
// import the mapbox styles
// alternatively can use a link tag in the head of public/index.html
// see https://docs.mapbox.com/mapbox-gl-js/api/
import "mapbox-gl/dist/mapbox-gl.css";
import "./app.css";

// Grab the access token from your Mapbox account
// I typically like to store sensitive things like this
// in a .env file
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

/**
 * TODO - Sources to Add
 * Show how to add layers before/after other layers
 * [X] avalanche paths
 * [X] bus stops
 * [X] snotel sites
 * [ ] contours
 * [X] 3d terrain
 * [X] sky layer
 */

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
      center: [-111.69, 40.581],
      zoom: 11,
    });

    // only want to work with the map after it has fully loaded
    map.on("load", () => {
      // avalanche paths source
      map.addSource("avalanche-paths", {
        type: "vector",
        url: "mapbox://lcdesigns.arckuvnm",
      });

      // snotel sites source
      map.addSource("snotel-sites", {
        type: "geojson",
        data: SnotelSites,
      });

      // bus routes source
      map.addSource("bus-routes", {
        type: "geojson",
        data:
          "https://opendata.arcgis.com/datasets/4347f3565fbe4d5dbb97b016768b8907_0.geojson",
      });

      // avalanche paths layer
      map.addLayer({
        id: "avalanche-paths-fill",
        type: "fill",
        source: "avalanche-paths",
        "source-layer": "Utah_Avalanche_Paths-9s9ups",
        paint: {
          "fill-opacity": 0.5,
          "fill-color": "#f05c5c",
        },
      });

      // snotel sites
      map.addLayer({
        id: "snotel-sites-circle",
        type: "circle",
        source: "snotel-sites",
        paint: {
          "circle-color": "#ffff00",
          "circle-radius": 8,
          "circle-stroke-color": "#333333",
          "circle-stroke-width": 2,
        },
      });

      // bus routes
      map.addLayer({
        id: "bus-routes-line",
        type: "line",
        source: "bus-routes",
        paint: {
          "line-color": "#15cc09",
          "line-width": 4,
        },
      });

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
    });

    // cleanup function to remove map on unmount
    return () => map.remove();
  }, []);

  return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />;
};

export default App;
