import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import mapboxgl from "mapbox-gl";

/**
 * import the mapbox styles
 * alternatively can use a link tag in the head of public/index.html
 * see https://docs.mapbox.com/mapbox-gl-js/api/
 */
import "../../node_modules/mapbox-gl/dist/mapbox-gl.css";

/**
 * Grab the access token from your Mapbox account
 * I typically like to store sensitive things like this
 * in a .env file
 */
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export const Map = ({
  center = [0, 0],
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

    /**
     * only want to work with the map after it has fully loaded
     * once the map has loaded, update our state with the value of the map var
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

  return (
    <div ref={mapContainer} style={{ width: "100%", height: "100vh" }}></div>
  );
};

Map.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number),
  basemap: PropTypes.string,
  zoom: PropTypes.number,
};
