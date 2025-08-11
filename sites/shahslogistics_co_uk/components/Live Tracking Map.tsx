"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Truck } from "lucide-react"; // Only allowed icons

// Define the interface for the component's props
interface LiveTrackingMapProps {
  mapType: "realtime-tracker"; // From blueprint: "realtime-tracker"
  centerLat: string; // From blueprint: "34.0522"
  centerLng: string; // From blueprint: "-118.2437"
}

// Define types for a simulated vehicle
interface Vehicle {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: "moving" | "stopped";
}

const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  mapType,
  centerLat,
  centerLng,
}) => {
  // Convert string coordinates to numbers for calculation
  const defaultLat = parseFloat(centerLat);
  const defaultLng = parseFloat(centerLng);

  // State for simulated vehicles
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => [
    {
      id: "V001",
      name: "Truck 1",
      lat: defaultLat + 0.005,
      lng: defaultLng - 0.005,
      status: "moving",
    },
    {
      id: "V002",
      name: "Truck 2",
      lat: defaultLat - 0.003,
      lng: defaultLng + 0.008,
      status: "moving",
    },
    {
      id: "V003",
      name: "Truck 3",
      lat: defaultLat + 0.002,
      lng: defaultLng + 0.001,
      status: "stopped",
    },
  ]);

  // Ref for the map container to get its dimensions
  const mapRef = useRef<HTMLDivElement>(null);

  // Simulate real-time movement of vehicles
  useEffect(() => {
    // Only simulate if mapType is realtime-tracker
    if (mapType !== "realtime-tracker") return;

    const interval = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => {
          if (vehicle.status === "moving") {
            const newLat = vehicle.lat + (Math.random() - 0.5) * 0.0002; // Small random movement
            const newLng = vehicle.lng + (Math.random() - 0.5) * 0.0003; // Small random movement
            return { ...vehicle, lat: newLat, lng: newLng };
          }
          return vehicle;
        })
      );
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [mapType]);

  // Function to convert lat/lng to pixel position within the map container
  // This is a highly simplified projection for visual representation only
  const getPixelPosition = (
    latitude: number,
    longitude: number
  ): { x: number; y: number } => {
    if (!mapRef.current) {
      return { x: 50, y: 50 }; // Default to center if ref not ready
    }

    const { clientWidth, clientHeight } = mapRef.current;

    // Define a scale. For a 400px tall map, a difference of 0.01 lat/lng could be 50px
    const scaleFactorLat = clientHeight / 0.02; // Map 0.02 lat difference to full height
    const scaleFactorLng = clientWidth / 0.02; // Map 0.02 lng difference to full width

    // Calculate pixel offsets from the center of the map
    const offsetX = (longitude - defaultLng) * scaleFactorLng;
    const offsetY = (latitude - defaultLat) * -scaleFactorLat; // Latitude increases downwards in pixel space

    // Convert offsets to percentage for responsive positioning
    const x = (clientWidth / 2 + offsetX) / clientWidth * 100;
    const y = (clientHeight / 2 + offsetY) / clientHeight * 100;

    return { x, y };
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-xl border border-gray-200 w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Live Tracking Map
      </h2>
      <p className="text-gray-600 mb-6">
        Monitor your fleet and shipments in real-time.
      </p>

      <div
        ref={mapRef}
        className="relative bg-gray-200 rounded-lg overflow-hidden w-full aspect-video md:h-96 h-64 border border-gray-300"
        style={{
          backgroundImage:
            "url('/images/map-placeholder.png')", // Placeholder image for map
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-label="Interactive map showing vehicle locations"
      >
        {/* Placeholder for map if an actual image isn't available */}
        {!mapRef.current && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-lg">
            Loading Map&hellip;
          </div>
        )}

        {/* Central Map Pin marker */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${getPixelPosition(defaultLat, defaultLng).x}%`,
            top: `${getPixelPosition(defaultLat, defaultLng).y}%`,
          }}
          title="Map Center"
        >
          <MapPin className="h-8 w-8 text-indigo-600 drop-shadow-md" />
        </div>

        {/* Render simulated vehicles */}
        {vehicles.map((vehicle) => {
          const { x, y } = getPixelPosition(vehicle.lat, vehicle.lng);
          return (
            <div
              key={vehicle.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear ${
                vehicle.status === "stopped" ? "opacity-70" : ""
              }`}
              style={{ left: `${x}%`, top: `${y}%` }}
              title={`${vehicle.name}: ${vehicle.status === "moving" ? "In Transit" : "Stopped"}`}
            >
              <Truck
                className={`h-6 w-6 ${
                  vehicle.status === "moving" ? "text-blue-600" : "text-gray-700"
                } drop-shadow-sm`}
              />
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap bg-white bg-opacity-80 px-1 py-0.5 rounded shadow-sm">
                {vehicle.name}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-4 justify-between items-center text-sm text-gray-700">
        <p>
          Currently tracking{" "}
          <span className="font-semibold text-indigo-700">
            {vehicles.length}
          </span>{" "}
          vehicles.
        </p>
        <ul className="flex flex-wrap gap-4">
          <li className="flex items-center gap-1">
            <Truck className="h-4 w-4 text-blue-600" /> In Transit
          </li>
          <li className="flex items-center gap-1">
            <Truck className="h-4 w-4 text-gray-700" /> Stopped
          </li>
          <li className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-indigo-600" /> Map Center
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LiveTrackingMap;