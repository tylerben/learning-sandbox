import { useCallback, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

import { MapService } from "../../utilities";

export const useMap = (ref, mapConfig) => {
  const [map, setMap] = useState(null);
  const [mapStatus, setMapStatus] = useState({
    map: {
      created: false,
      loaded: false,
    },
    sources: {
      loaded: false,
      added: false,
    },
    layers: {
      loaded: false,
      added: false,
    },
  });
  const [sources, setSources] = useState([]);
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    if (ref?.current && !mapStatus.map.created) {
      const newMap = new mapboxgl.Map({
        container: ref.current,
        ...mapConfig,
      });
      setMap(newMap);
      setMapStatus((s) => ({
        ...s,
        map: {
          ...s.map,
          created: true,
        },
      }));
      newMap.on("load", () => {
        setMapStatus((s) => ({
          ...s,
          map: {
            ...s.map,
            loaded: true,
          },
        }));
      });
    }
  }, [ref, mapConfig, mapStatus.map.created]);

  const loadMapData = useCallback(() => {
    const shouldLoadData =
      !!map && mapStatus.map.loaded && !mapStatus.sources.loaded;
    async function loadData() {
      const fetchedSources = await MapService.getSources();
      const fetchedLayers = await MapService.getLayers();
      setSources(fetchedSources);
      setLayers(fetchedLayers);
      if (!mapStatus.sources.added) {
        fetchedSources.forEach((source) => {
          const cleanedSource = { ...source };
          delete cleanedSource.id;
          map.addSource(source.id, cleanedSource);
        });

        if (!mapStatus.layers.added) {
          fetchedLayers.forEach((layer) => {
            map.addLayer(layer);
          });
        }
      }
      setMapStatus((s) => ({
        ...s,
        sources: {
          loaded: true,
          added: true,
        },
        layers: {
          loaded: true,
          added: true,
        },
      }));
    }
    if (shouldLoadData) {
      loadData();
    }
  }, [map, mapStatus.map.loaded, mapStatus.sources, mapStatus.layers]);

  const updateLayerVisibility = (id, visible) => {
    if (!!map && !!map.getLayer(id)) {
      const visibleValue = visible ? "visible" : "none";
      map.setLayoutProperty(id, "visibility", visibleValue);
      setLayers((s) => {
        return s.map((layer) => {
          if (layer.id === id) {
            return {
              ...layer,
              layout: {
                ...layer.layout,
                visibility: visibleValue,
              },
            };
          }
          return layer;
        });
      });
    }
  };

  useEffect(() => {
    loadMapData();
  }, [loadMapData]);

  return {
    layers,
    map,
    sources,
    updateLayerVisibility,
  };
};
