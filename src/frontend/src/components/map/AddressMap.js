// AddressMap.js
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Sửa lỗi icon mặc định bị vỡ
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/**
 * RecenterView: component ẩn, dùng useMap() để di chuyển
 * map mỗi khi prop 'center' thay đổi.
 */
function RecenterView({ center }) {
  const map = useMap();

  useEffect(() => {
    // Di chuyển map đến toạ độ mới
    map.setView(center, map.getZoom());
    
  }, [center, map]);

  return null;
}

export default function AddressMap({ address }) {
  const [position, setPosition] = useState([10.762622, 106.660172]); // Mặc định: TP.HCM

  // Mỗi khi 'address' thay đổi, gọi Nominatim để geocoding
  useEffect(() => {
    if (address.trim() !== "") {
      const timer = setTimeout(() => {
        fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
          {
            headers: {
              "User-Agent": "MyReactApp/1.0 (myemail@example.com)",
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data && data.length > 0) {
              const { lat, lon } = data[0];
              setPosition([parseFloat(lat), parseFloat(lon)]);
            }
          })
          .catch((err) => console.error("Geocoding error:", err));
      }, 500); // Delay 500ms trước khi gọi API
  
      return () => clearTimeout(timer); // Clean up timer khi component unmount hoặc address thay đổi
    }
  }, [address]);

  return (
    <MapContainer
      center={position}
      zoom={16}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
                         OpenStreetMap
                       </a> contributors'
      />
      <Marker position={position}>
        <Popup>Đây là vị trí tương ứng với địa chỉ: {address}</Popup>
      </Marker>

      {/* RecenterView sẽ theo dõi position và gọi setView */}
      <RecenterView center={position} />
    </MapContainer>
  );
}