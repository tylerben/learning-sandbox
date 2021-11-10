import React from "react";
import { Map } from "./";

/**
 * Define some spatial data sources for
 * our map component story
 */
const Sources = [
  {
    id: "avalanche-paths",
    type: "vector",
    url: "mapbox://lcdesigns.arckuvnm",
  },
];

/**
 * Define some layers based on the sources to
 * add to our map component story
 */
const Layers = [
  {
    id: "avalanche-paths-fill",
    type: "fill",
    source: "avalanche-paths",
    "source-layer": "Utah_Avalanche_Paths-9s9ups",
    paint: {
      "fill-opacity": 0.5,
      "fill-color": "#f05c5c",
    },
  },
];

/* eslint-disable import/no-anonymous-default-export */
export default {
  title: "Map",
  component: Map,
  parameters: { layout: "fullscreen" },
};

const Template = (args) => <Map {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  center: [-111.75, 40.581],
  controls: [{ type: "navigation" }],
  basemap: "mapbox://styles/mapbox/outdoors-v11",
  zoom: 12,
};

export const MapLayers = () => {
  return (
    <Map
      center={[-111.75, 40.581]}
      controls={[{ type: "navigation" }]}
      layers={Layers}
      sources={Sources}
      basemap="mapbox://styles/mapbox/outdoors-v11"
      zoom={12}
    />
  );
};
