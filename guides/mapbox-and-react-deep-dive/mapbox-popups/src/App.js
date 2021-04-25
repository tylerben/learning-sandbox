import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
// import the mapbox styles
// alternatively can use a link tag in the head of public/index.html
// see https://docs.mapbox.com/mapbox-gl-js/api/
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

// Grab the access token from your Mapbox account
// I typically like to store sensitive things like this
// in a .env file
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

/**
 * Our custom Popup component used to render a nicely styled
 * map popup with additional information about the
 * user's selected bus route
 */
const Popup = ({ routeName, routeNumber, city, type }) => (
  <div className="popup">
    <h3 className="route-name">{routeName}</h3>
    <div className="route-metric-row">
      <h4 className="row-title">Route #</h4>
      <div className="row-value">{routeNumber}</div>
    </div>
    <div className="route-metric-row">
      <h4 className="row-title">Route Type</h4>
      <div className="row-value">{type}</div>
    </div>
    <p className="route-city">Serves {city}</p>
  </div>
);

const App = () => {
  const mapContainer = useRef();
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));

  // this is where all of our map logic is going to live
  // adding the empty dependency array ensures that the map
  // is only rendered once
  useEffect(() => {
    // create the map and configure it
    // check out the API reference for more options
    // https://docs.mapbox.com/mapbox-gl-js/api/map/
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v11",
      center: [-111.94, 40.611],
      zoom: 12,
    });

    // only want to work with the map after it has fully loaded
    // if you try to add sources and layers before the map has loaded
    // things will not work properly
    map.on("load", () => {
      // bus routes source
      // another example of using a geojson source
      // this time we are hitting an ESRI API that returns
      // data in the geojson format
      // see https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#geojson
      map.addSource("bus-routes", {
        type: "geojson",
        data:
          "https://opendata.arcgis.com/datasets/4347f3565fbe4d5dbb97b016768b8907_0.geojson",
      });

      // bus routes - line layer
      // see https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#line
      map.addLayer({
        id: "bus-routes-line",
        type: "line",
        source: "bus-routes",
        paint: {
          "line-color": "#4094ae",
          "line-width": 4,
        },
      });
    });

    /**
     * Event handler for defining what happens when a user clicks on the map
     * In this example, we are checking if the user has clicked on a bus route
     * If they have, we want to render a popup with the data for the selected
     * bus route
     * Else, do nothing
     */
    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["bus-routes-line"],
      });
      if (features.length > 0) {
        const feature = features[0];
        // create popup node
        const popupNode = document.createElement("div");
        ReactDOM.render(
          <Popup
            routeName={feature?.properties?.LineName}
            routeNumber={feature?.properties?.LineAbbr}
            city={feature?.properties?.City}
            type={feature?.properties?.RouteType}
          />,
          popupNode
        );
        popUpRef.current
          .setLngLat(e.lngLat)
          .setDOMContent(popupNode)
          .addTo(map);
      }
    });

    // cleanup function to remove map on unmount
    return () => map.remove();
  }, []);

  return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />;
};

export default App;
