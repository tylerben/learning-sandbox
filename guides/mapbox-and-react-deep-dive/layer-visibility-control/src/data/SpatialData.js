const AvalanchePathsSource = {
  id: "avalanche-paths",
  type: "vector",
  url: "mapbox://lcdesigns.arckuvnm",
};

const WeatherStationsSource = {
  id: "weather-stations",
  type: "geojson",
  data: "https://opendata.arcgis.com/datasets/f325911db6d9499fb935494c01fc3f94_0.geojson",
};

const SkiLiftsSource = {
  id: "ski-lifts",
  type: "vector",
  url: "mapbox://lcdesigns.485yh7ox",
};

const AvalanchePathsLayer = {
  id: "avalanche-paths-fill",
  name: "Avalanche Paths",
  type: "fill",
  source: "avalanche-paths",
  "source-layer": "Utah_Avalanche_Paths-9s9ups",
  paint: {
    "fill-opacity": 0.5,
    "fill-color": "#f05c5c",
  },
  layout: {
    visibility: "visible",
  },
};

const SkiLiftsLayer = {
  id: "ski-lifts-line",
  name: "Ski Lifts",
  type: "line",
  source: "ski-lifts",
  "source-layer": "SkiLifts",
  paint: {
    "line-width": 2,
    "line-color": "#252526",
  },
  layout: {
    visibility: "visible",
  },
};

const WeatherStationsLayer = {
  id: "weather-stations-circle",
  name: "Weather Stations",
  type: "circle",
  source: "weather-stations",
  paint: {
    "circle-color": "#4094ae",
    "circle-radius": 4,
  },
  layout: {
    visibility: "none",
  },
};

export const Sources = [
  AvalanchePathsSource,
  SkiLiftsSource,
  WeatherStationsSource,
];

export const Layers = [
  AvalanchePathsLayer,
  SkiLiftsLayer,
  WeatherStationsLayer,
];
