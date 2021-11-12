import { useMemo, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import s from "./Map.module.css";
import { useMap } from "../../hooks/useMap/useMap";
import { LayerControl, StyleControl } from "../Controls";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export const Map = () => {
  const mapContainer = useRef(null);
  const { layers, updateLayerStyle, updateLayerVisibility } = useMap(
    mapContainer,
    {
      style: "mapbox://styles/mapbox/outdoors-v11",
      center: [-111.75, 40.581],
      zoom: 11,
    }
  );

  const avyPathLayer = useMemo(() => {
    if (layers) {
      return layers.find((layer) => layer.id === "avalanche-paths-fill");
    }
  }, [layers]);

  return (
    <div id="map" className={s.map} ref={mapContainer}>
      <StyleControl
        layer={avyPathLayer}
        onStyleChange={updateLayerStyle}
        title="Avalanche Paths Fill Color"
      />
      <LayerControl layers={layers} onToggle={updateLayerVisibility} />
    </div>
  );
};
