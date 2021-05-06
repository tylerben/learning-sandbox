import React, { useState, useEffect } from "react";
import { Map } from "./components/Map";

/**
 * Define some spatial data sources for
 * our map component
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
 * add to our map component
 */
const Layers = [
  {
    id: "avalanche-paths-fill",
    type: "fill",
    source: "avalanche-paths",
    paint: {
      "fill-opacity": 0.5,
      "fill-color": "#f05c5c",
    },
  },
];

const App = () => {
  const [sources] = useState(Sources);
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

  /**
   * Logic for updating the value property for each filter
   * whenever the underlying filterValues state is updated
   */
  useEffect(() => {
    setFilters((s) => {
      return s.map((filter) => ({
        ...filter,
        value: [...filterValues[filter.layer]],
      }));
    });
  }, [filterValues]);

  /**
   * Logic for updating the filter applied to each map layer
   * when the underlying filters change
   * If the user has applied filter values we want to append the
   * filter to the layer
   * Else, we want to remove the filter prop from the layer
   * The filter values are converted into a Mapbox expression
   * which is how filters are expressed in Mapbox GL JS
   * In this example, since we are working with multi-select filters,
   * we need to use the match variation so we can pass an array
   * of the currently selected filter values
   * For more information on Mapbox Expressions, check out the docs
   * https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/
   */
  useEffect(() => {
    setLayers((s) => {
      return s.map((layer) => {
        let updatedLayer = { ...layer };
        const filter = filters.find((filter) => filter.layer === layer.id);
        const { field, value } = filter;
        if (value.length > 0) {
          updatedLayer.filter = [
            "all",
            ["match", ["get", field], [...value], true, false],
          ];
        } else {
          delete updatedLayer.filter;
        }
        return updatedLayer;
      });
    });
  }, [filters]);

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
