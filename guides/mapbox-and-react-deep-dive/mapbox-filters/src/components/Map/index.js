import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import mapboxgl from "mapbox-gl";
import { Filter } from "../Filter";

/**
 * import the mapbox styles
 * alternatively can use a link tag in the head of public/index.html
 * see https://docs.mapbox.com/mapbox-gl-js/api/
 */
import "../../../node_modules/mapbox-gl/dist/mapbox-gl.css";

/**
 * Grab the access token from your Mapbox account
 * I typically like to store sensitive things like this
 * in a .env file
 */
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export const Map = ({
  center = [0, 0],
  controls = [],
  filters = [],
  sources = [],
  layers = [],
  basemap = "mapbox://styles/mapbox/outdoors-v11",
  zoom = 12,
}) => {
  const mapContainer = useRef();
  const [map, setMap] = useState();

  /**
   * this is where all of our map logic is going to live
   * adding the empty dependency array ensures that the map is only rendered once
   */
  useEffect(() => {
    /**
     * create the map and configure it based on the provided props
     * check out the API reference for more options
     * https://docs.mapbox.com/mapbox-gl-js/api/map/
     */
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: basemap,
      center,
      zoom,
    });

    // determine out if we need to add a navigation control to the map
    const navEnabled =
      controls.filter(({ type }) => type === "navigation").length > 0;

    /**
     * If the navigation control is enabled, add it to the map
     */
    if (navEnabled) {
      const nav = new mapboxgl.NavigationControl();
      map.addControl(nav, "top-right");
    }

    /**
     * only want to work with the map after it has fully loaded
     * once the map has loaded, update our state with the value of the map var
     * flip the map loaded switch to true on load
     */
    map.on("load", () => {
      setMap(map);
    });

    // cleanup function to remove map on unmount
    return () => map.remove();
    /**
     * We disable eslint on the dependency array because
     * we only want the map to be initialized once
     * It is also just easier to update the map in separate useEffect hooks
     * when props like center, zoom change
     */
  }, []); //eslint-disable-line

  /**
   * Logic that updates the map centering whenever the center prop changes
   */
  useEffect(() => {
    map?.setCenter(center);
  }, [map, center]);

  /**
   * Logic that updates the map zoom level whenever the zoom prop changes
   */
  useEffect(() => {
    map?.setZoom(zoom);
  }, [map, zoom]);

  /**
   * Dedicated logic for adding sources and layers as well as updating layer filters
   * We first check to make sure that the map style is loaded and
   * that sources and layers were provided
   * Next, we loop through the provided sources and check if they need to be added
   * to the map. If so, add em, else do nothing
   * Finally, we loop through the provided layers and check if they
   * have already been added to the map
   * If they have, then we apply our filters to the layer
   * Else, just add em to the map
   * This logic runs whenever the map, sources, or layers state/props
   * are updated
   */
  useEffect(() => {
    const mapReady = map?.isStyleLoaded();
    const dataReady = sources?.length > 0 && layers.length > 0;

    if (mapReady && dataReady) {
      sources.forEach((source) => {
        if (map.getSource(source.id)) return;
        const cleanSource = { ...source };
        if (source.type === "geojson") {
          delete cleanSource.id; // weird hack necessary when working with the geojson source type
        }
        map.addSource(source.id, cleanSource);
      });
      layers.forEach((layer) => {
        if (map.getLayer(layer.id)) {
          map.setFilter(layer.id, layer.filter ? layer.filter : null);
        } else {
          map.addLayer(layer);
        }
      });
    }
  }, [map, sources, layers]);

  return (
    <div ref={mapContainer} style={{ width: "100%", height: "100vh" }}>
      {filters.map(({ layer, options, value, title, onChange }, index) => (
        <Filter
          key={layer}
          id={layer}
          options={options}
          value={value}
          title={title}
          onChange={onChange}
          style={{ left: 15 + 290 * index }}
        />
      ))}
    </div>
  );
};

Map.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number),
  layers: PropTypes.arrayOf(PropTypes.object),
  controls: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["navigation", "filter"]).isRequired,
    })
  ),
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      layer: PropTypes.string.isRequired,
      title: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
      defaultValue: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      ),
    })
  ),
  sources: PropTypes.arrayOf(PropTypes.object),
  basemap: PropTypes.string,
  zoom: PropTypes.number,
};
