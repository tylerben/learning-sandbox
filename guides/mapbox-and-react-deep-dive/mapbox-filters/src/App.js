import React, { useState, useEffect } from "react";
import { Map } from "./components/Map";

/**
 * Default map configs
 * If these values are going to be static,
 * it is generally best practice to hoist these values
 * outside of our component scope
 */
const mapDefaults = {
  basemap: "mapbox://styles/mapbox/outdoors-v11",
  center: [-111.65, 40.581],
  controls: [{ id: "nav", type: "navigation" }],
  zoom: 12,
};

/**
 * Define our spatial data sources for our map
 * The Sources variable is essentially an array of objects
 * that match the Mapbox sources specification
 * You can add any source type available in Mapbox GL JS,
 * you just need to make sure that the object that is used to
 * represent the source matches the specification that is defined
 * for the source type
 * For more information on how sources are defined in Mapbox,
 * check out the docs
 * https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/
 */
const Sources = [
  {
    id: "avalanche-paths",
    type: "geojson",
    data:
      "https://opendata.arcgis.com/datasets/0df199cef1704e5287ae675ee3dbd3bd_0.geojson",
  },
  {
    id: "ski-lifts",
    type: "geojson",
    data:
      "https://opendata.arcgis.com/datasets/51d8a963411d4356ab3fa7a24146d203_0.geojson",
  },
];

/**
 * Define our layers based on the sources to add to our map
 * The Layers variable is essentially an array of objects that match
 * the Mapbox layers specification
 * You can add any layer type available in Mapbox GL JS,
 * you just need to make sure that the object is defined following
 * the style specification for the layer type
 * For more information on how sources are defined in Mapbox,
 * check out the docs
 * https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/
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
  {
    id: "ski-lifts-line",
    type: "line",
    source: "ski-lifts",
    paint: {
      "line-color": "#403965",
      "line-width": 2.5,
    },
  },
];

/**
 * Utility handler for returning an array of the user's
 * currently selected filter values.
 * This function is passed to the setState handlers within
 * the App component
 * Loops through the existing filters and only updates the values
 * associated with filter that matches the provided layerId
 * Checks to see if the value the user clicked on is already
 * selected
 * If it is already selected, unselect it and remove it from the array
 * of filter values
 * Else, add it to the array of filter values
 * @param {array} existingFilters existing filter objects
 * @param {string} layerId id for layer that needs its value updated
 * @param {string | number} value selected filter value
 * @returns {array} returns the updated filter object
 */
const updateFilterValues = (existingFilters, layerId, value) => {
  return existingFilters.map((filter) => {
    if (filter.layer === layerId) {
      let newValues = [...filter.value];
      if (newValues.includes(value)) {
        const index = newValues.indexOf(value);
        newValues.splice(index, 1);
      } else {
        newValues.push(value);
      }
      return {
        ...filter,
        value: newValues,
      };
    }
    return filter;
  });
};

const App = () => {
  const [sources] = useState(Sources);
  const [layers, setLayers] = useState(Layers);
  const [filters, setFilters] = useState([
    {
      layer: "ski-lifts-line",
      field: "RESORT",
      title: "Ski Resort",
      options: [
        {
          value: "Snowbird Ski and Summer Resort",
          label: "Snowbird Ski and Summer Resort",
        },
        { value: "Alta Ski Area", label: "Alta Ski Area" },
        {
          value: "Solitude Mountain Resort",
          label: "Solitude Mountain Resort",
        },
        { value: "Brighton Ski Resort", label: "Brighton Ski Resort" },
      ],
      value: [],
      onChange: (layer, val) => {
        setFilters((filters) => updateFilterValues(filters, layer, val));
      },
    },
    {
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
      onChange: (layer, val) => {
        setFilters((filters) => updateFilterValues(filters, layer, val));
      },
    },
  ]);

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
        if (!filter) return updatedLayer;
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
      basemap={mapDefaults.basemap}
      center={mapDefaults.center}
      controls={mapDefaults.controls}
      filters={filters}
      layers={layers}
      sources={sources}
      zoom={mapDefaults.zoom}
    />
  );
};

export default App;
