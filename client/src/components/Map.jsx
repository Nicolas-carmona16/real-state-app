import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ lat, lon }) => {
  useEffect(() => {
    // Crea el mapa y establece las coordenadas
    const map = L.map("map").setView([lat, lon], 13);

    // Añade la capa de mapa de OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Añade un marcador en las coordenadas proporcionadas
    L.marker([lat, lon]).addTo(map);
  }, [lat, lon]);

  return <div id="map" className="h-80"></div>;
};

export default Map;