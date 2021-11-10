import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import s from "./Map.module.css";
import { useMap } from "../../hooks/useMap/useMap";
import { LayerControl } from "../LayerControl";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export const Map = () => {
  const mapContainer = useRef(null);
  const { layers, map, updateLayerVisibility } = useMap(mapContainer, {
    style: "mapbox://styles/mapbox/outdoors-v11",
    center: [-111.75, 40.581],
    zoom: 11,
  });

  return (
    <div id="map" className={s.map} ref={mapContainer}>
      <LayerControl layers={layers} onToggle={updateLayerVisibility} />
    </div>
  );
};
