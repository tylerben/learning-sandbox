import React from "react";
import { Map } from "./components/Map";

const App = () => {
  return (
    <Map
      center={[-122.7498, 45.5935]}
      basemap="mapbox://styles/mapbox/streets-v11"
      zoom={14}
    />
  );
};

export default App;
