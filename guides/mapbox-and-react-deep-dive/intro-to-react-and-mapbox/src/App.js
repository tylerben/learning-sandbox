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
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-87.903982, 43.020403],
      zoom: 12,
    });

    // cleanup function to remove map on unmount
    return () => map.remove();
  }, []);

  return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />;
};

export default App;
