"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";
import { Building, getBuildings } from "@/lib/microcms";
import SearchSidebar from "@/components/SearchSidebar";
import BuildingDetails from "@/components/BuildingDetails";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

export default function Home() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [view, setView] = useState("2D");
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );

  useEffect(() => {
    if (mapContainer.current === null) return;

    const initializeMap = async () => {
      const newMap = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/light-v11",
        center: [139.7670516, 35.6811673],
        zoom: 15,
        pitch: 0,
        bearing: 0,
      });

      newMap.on("style.load", () => {
        const language = new MapboxLanguage({ defaultLanguage: "ja" });
        newMap.addControl(language);
      });

      newMap.on("load", async () => {
        setMap(newMap);
        newMap.resize();

        // 建築物データを取得
        const buildingsData = await getBuildings();
        setBuildings(buildingsData);

        // マーカーを追加
        buildingsData.forEach((building) => {
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div role="dialog" aria-label="${building.name}の詳細情報">
              <h3>${building.name}</h3>
              <p>建築家: ${building.architect}</p>
            </div>
          `);

          const el = document.createElement("div");
          el.className = "marker";
          el.style.backgroundImage = "url(https://placekitten.com/g/40/40)";
          el.style.width = "40px";
          el.style.height = "40px";
          el.style.backgroundSize = "100%";
          el.style.borderRadius = "50%";
          el.style.border = "2px solid #fff";

          new mapboxgl.Marker(el)
            .setLngLat([building.longitude, building.latitude])
            .setPopup(popup)
            .addTo(newMap);
        });
      });
    };

    initializeMap();

    return () => {
      setMap((prevMap) => {
        if (prevMap) prevMap.remove();
        return null;
      });
    };
  }, []);

  const toggleView = () => {
    if (map) {
      if (view === "2D") {
        map.easeTo({ pitch: 45, bearing: -17.6, zoom: 15.5 });
        setView("3D");
        map.addLayer({
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#aaa",
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.6,
          },
        });
      } else {
        map.easeTo({ pitch: 0, bearing: 0, zoom: 15 });
        setView("2D");
        map.removeLayer("3d-buildings");
      }
    }
  };

  const flyToBuilding = (building: Building) => {
    if (map) {
      map.flyTo({
        center: [building.longitude, building.latitude],
        zoom: 17,
        essential: true,
      });
      setSelectedBuilding(building);
    }
  };

  return (
    <main className="flex flex-col h-screen">
      <header className="flex justify-between items-center p-4 bg-background border-b">
        <h1 className="text-2xl font-bold">建築物地図サービス</h1>
        <Button variant="outline">ログイン</Button>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <SearchSidebar buildings={buildings} onBuildingClick={flyToBuilding} />
        <div className="flex-1 relative">
          <div
            ref={mapContainer}
            className="absolute inset-0"
            style={{ width: "100%", height: "100%" }}
          />
          <div className="absolute top-4 right-4 space-x-2">
            <Button onClick={toggleView}>
              <Layers className="mr-2 h-4 w-4" /> {view}表示
            </Button>
          </div>
        </div>
        {selectedBuilding && (
          <BuildingDetails
            building={selectedBuilding}
            onClose={() => setSelectedBuilding(null)}
          />
        )}
      </div>
    </main>
  );
}
