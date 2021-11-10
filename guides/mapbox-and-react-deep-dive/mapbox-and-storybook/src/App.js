import React, { useState, useEffect } from "react";
import { Map } from "./components/Map";

/**
 * Define some spatial data sources for
 * our map component story
 */
const Sources = [
  {
    id: "avalanche-paths",
    type: "geojson",
    data:
      "https://opendata.arcgis.com/datasets/0df199cef1704e5287ae675ee3dbd3bd_0.geojson",
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
    paint: {
      "fill-opacity": 0.5,
      "fill-color": "#f05c5c",
      // "fill-color": [
      //   "match",
      //   ["get", "RETURN_INTERVAL"],
      //   ["FREQUENT"],
      //   "#c50d44",
      //   ["OCCASIONAL TO FREQUENT", " OCCASIONAL TO FREQUENT"],
      //   "#e02e64",
      //   ["OCCASIONAL"],
      //   "#ba5208",
      //   ["INFREQUENT"],
      //   "#eedb5d",
      //   "#777",
      // ],
    },
  },
];

const App = () => {
  const [sources, setSources] = useState(Sources);
  const [layers, setLayers] = useState(Layers);
  const [filters, setFilters] = useState([
    {
      id: "avalanche-paths-fill",
      type: "filter",
      layer: "avalanche-paths-fill",
      field: "RETURN_INTERVAL",
      title: "Avalanche Frequency",
      options: [
        { value: "INFREQUENT", label: "Infrequent" },
        { value: "OCCASIONAL", label: "Occasional" },
        { value: "OCCASIONAL TO FREQUENT", label: "Occasional to Frequent" },
        { value: "FREQUENT", label: "Frequent" },
      ],
      value: [],
      onChange: (id, val) => {
        setFilterValues((s) => {
          let newValues = [...s[id]];
          if (s[id].includes(val)) {
            const index = newValues.indexOf(val);
            newValues.splice(index, 1);
          } else {
            newValues.push(val);
          }
          return {
            ...s,
            [id]: newValues,
          };
        });
      },
    },
  ]);
  const [filterValues, setFilterValues] = useState({
    "avalanche-paths-fill": [],
  });

  useEffect(() => {
    setFilters((s) => {
      return s.map((filter) => ({
        ...filter,
        value: [...filterValues[filter.layer]],
      }));
    });
    setLayers((s) => {
      return s.map((layer) => {
        let updatedLayer = { ...layer };
        const filterField = filters.find((filter) => filter.layer === layer.id)
          ?.field;
        if (filterValues[layer.id].length > 0) {
          updatedLayer.filter = [
            "all",
            [
              "match",
              ["get", filterField],
              [...filterValues[layer.id]],
              true,
              false,
            ],
          ];
        } else {
          delete updatedLayer.filter;
        }
        return updatedLayer;
      });
    });
  }, [filterValues]);

  return (
    <Map
      center={[-111.65, 40.581]}
      controls={[{ id: "nav", type: "navigation" }]}
      filters={filters}
      layers={layers}
      sources={sources}
      basemap="mapbox://styles/mapbox/outdoors-v11"
      zoom={12}
    />
  );
};

export default App;
