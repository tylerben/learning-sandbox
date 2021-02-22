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
      style: "mapbox://styles/mapbox/outdoors-v11",
      center: [-111.75, 40.581],
      zoom: 12,
      pitch: 60,
      bearing: 80,
    });

    // only want to work with the map after it has fully loaded
    // if you try to add sources and layers before the map has loaded
    // things will not work properly
    map.on("load", () => {
      // add mapbox terrain dem source for 3d terrain rendering
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxZoom: 16,
      });
      map.setTerrain({ source: "mapbox-dem" });

      // avalanche paths source
      // example of how to add a custom tileset hosted on Mapbox
      // you can grab the url from the details page for any tileset
      // you have created in Mapbox studio
      // see https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#vector
      map.addSource("avalanche-paths", {
        type: "vector",
        url: "mapbox://lcdesigns.arckuvnm",
      });

      // snotel sites source
      // example of using a geojson source
      // data is hosted locally as part of the application
      // see https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#geojson
      map.addSource("snotel-sites", {
        type: "geojson",
        data: SnotelSites,
      });

      // bus routes source
      // another example of using a geojson source
      // this time we are hitting an ESRI API that returns
      // data in the geojson format
      // see https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#geojson
      map.addSource("bus-routes", {
        type: "geojson",
        data:
          "https://opendata.arcgis.com/datasets/4347f3565fbe4d5dbb97b016768b8907_0.geojson",
      });

      // avalanche paths - fill layer
      // source-layer can be grabbed from the tileset details page
      // in Mapbox studio
      // see https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#fill
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

      // snotel sites - circle layer
      // see https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#circle
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

      // snotel sites - label layer
      // see https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#symbol
      map.addLayer({
        id: "snotel-sites-label",
        type: "symbol",
        source: "snotel-sites",
        layout: {
          "text-field": ["get", "Station Name"],
          "text-size": 14,
          "text-offset": [0, -1.5],
        },
        paint: {
          "text-color": "#ffff00",
          "text-halo-color": "#333333",
          "text-halo-width": 1,
        },
      });

      // bus routes - line layer
      // see https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#line
      map.addLayer({
        id: "bus-routes-line",
        type: "line",
        source: "bus-routes",
        paint: {
          "line-color": "#15cc09",
          "line-width": 4,
        },
      });

      // add a sky layer
      // the sky layer is a custom mapbox layer type
      // see https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#sky
      map.addLayer({
        id: "sky",
        type: "sky",
        paint: {
          "sky-type": "atmosphere",
          "sky-atmosphere-sun": [0.0, 90.0],
          "sky-atmosphere-sun-intensity": 15,
        },
      });
    });

    // cleanup function to remove map on unmount
    return () => map.remove();
  }, []);

  return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />;
};

export default App;
