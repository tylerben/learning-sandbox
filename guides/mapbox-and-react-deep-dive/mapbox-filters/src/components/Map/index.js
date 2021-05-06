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
mapboxgl.accessToken =
  "pk.eyJ1IjoibGNkZXNpZ25zIiwiYSI6ImNrbGdxcXQ1NDI3NmMydnRreTZwM3k0YnoifQ.gzPL-l7g-Dw2nOg4gdVb9w";

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
  const [mapIsLoaded, setMapIsLoaded] = useState(false);
  const [layersLoaded, setLayersLoaded] = useState(false);

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
      setMapIsLoaded(true);
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
    if (map && mapIsLoaded) {
      map.setCenter(center);
    }
  }, [map, mapIsLoaded, center]);

  /**
   * Logic that updates the map zoom level whenever the zoom prop changes
   */
  useEffect(() => {
    if (map && mapIsLoaded) {
      map.setZoom(zoom);
    }
  }, [map, mapIsLoaded, zoom]);

  /**
   * Dedicated logic for adding sources and layers on load
   * A separate useEffect hook manages updating layers when
   * their attributes (i.e. filters) update
   * This logic only executes once and only after the map is loaded
   * If you try to add sources and layers before the map has loaded
   * things will not work properly
   */
  useEffect(() => {
    if (map && mapIsLoaded && !layersLoaded) {
      if (sources?.length > 0 && layers.length > 0) {
        sources.forEach((source) => {
          const cleanSource = { ...source };
          if (source.type === "geojson") {
            delete cleanSource.id; // weird hack necessary when working with the geojson source type
          }
          map.addSource(source.id, cleanSource);
        });
        layers.forEach((layer) => {
          map.addLayer(layer);
        });
        setLayersLoaded(true);
      }
    }
  }, [map, sources, layers, mapIsLoaded, layersLoaded]);

  /**
   * Dedicated logic for updating layer filters
   * Logic runs whenever the underlying data changes
   * Logic only runs if the map and layers have already been added to the map
   * Currently, we only update the filters applied to the layer but it is
   * really easy to extend this logic to things like layer styling
   */
  useEffect(() => {
    if (map && mapIsLoaded && layersLoaded) {
      layers.forEach((layer) => {
        map.setFilter(layer.id, layer.filter ? layer.filter : null);
      });
    }
  }, [map, mapIsLoaded, layersLoaded, layers]);

  return (
    <div ref={mapContainer} style={{ width: "100%", height: "100vh" }}>
      {filters.map(({ id, options, value, title, onChange }) => (
        <Filter
          key={id}
          id={id}
          options={options}
          value={value}
          title={title}
          onChange={onChange}
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
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["navigation", "filter"]).isRequired,
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
