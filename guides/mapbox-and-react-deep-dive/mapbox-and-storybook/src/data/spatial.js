export const Sources = [
  {
    id: "avalanche-paths",
    type: "vector",
    url: "mapbox://lcdesigns.arckuvnm",
  },
];

export const Layers = [
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
