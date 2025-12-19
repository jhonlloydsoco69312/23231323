import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function CampusMap() {
  const [locations, setLocations] = useState([]);
  const [start, setStart] = useState(null);
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    const { data, error } = await supabase.from("locations").select("*");
    if (!error) setLocations(data);
  }

  // Distance calculation
  const calculateDistance = (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy).toFixed(2);
  };

  const calculateWalkingTime = (distance) => {
    const minutes = Math.ceil(distance / 2);
    return minutes < 1 ? "< 1 min" : `${minutes} min`;
  };

  const resetNavigation = () => {
    setStart(null);
    setDestination(null);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-2">📍 Campus Map Navigation</h1>
      <p className="text-sm text-gray-600 text-center mb-4">
        Click one building to set <strong>Start</strong>, then another to set{" "}
        <strong>Destination</strong>
      </p>

      <div className="relative w-full max-w-6xl mx-auto">
        {/* MAP IMAGE (BOTTOM LAYER) */}
        <img
          src="./public/campus-map.jpg"   // 🔥 image must be in /public
          alt="Campus Map"
          className="w-full rounded-lg shadow relative z-0"
        />

        {/* SVG OVERLAY (MIDDLE LAYER) */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
            </marker>
          </defs>

          {/* PATH */}
          {start && destination && (
            <line
              x1={`${start.center_x}%`}
              y1={`${start.center_y}%`}
              x2={`${destination.center_x}%`}
              y2={`${destination.center_y}%`}
              stroke="#3b82f6"
              strokeWidth="4"
              strokeDasharray="8,4"
              markerEnd="url(#arrowhead)"
            />
          )}

          {/* START MARKER */}
          {start && (
            <circle
              cx={`${start.center_x}%`}
              cy={`${start.center_y}%`}
              r="10"
              fill="#22c55e"
            />
          )}

          {/* DESTINATION MARKER */}
          {destination && (
            <circle
              cx={`${destination.center_x}%`}
              cy={`${destination.center_y}%`}
              r="14"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
            />
          )}
        </svg>

        {/* CLICKABLE BUILDINGS (TOP LAYER) */}
        {locations.map((loc) => (
          <button
            key={loc.id}
            title={loc.name}
            className={`absolute z-20 rounded border-2 transition-all ${
              start?.id === loc.id
                ? "border-green-500 bg-green-200 bg-opacity-20"
                : destination?.id === loc.id
                ? "border-red-500 bg-red-200 bg-opacity-20"
                : "border-transparent hover:border-blue-500 hover:bg-blue-100 hover:bg-opacity-10"
            }`}
            style={{
              top: loc.top,
              left: loc.left,
              width: loc.width,
              height: loc.height,
            }}
            onClick={() => {
              if (!start) setStart(loc);
              else if (!destination) setDestination(loc);
              else {
                setStart(loc);
                setDestination(null);
              }
            }}
          />
        ))}
      </div>

      {/* INFO PANEL */}
      {start && destination && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-2">
            {start.name} ➜ {destination.name}
          </h2>

          <div className="bg-blue-50 p-4 rounded-lg text-sm">
            <div className="flex justify-between mb-2">
              <span>📏 Distance:</span>
              <span className="font-bold">
                {calculateDistance(
                  start.center_x,
                  start.center_y,
                  destination.center_x,
                  destination.center_y
                )}{" "}
                units
              </span>
            </div>
            <div className="flex justify-between">
              <span>⏱️ Estimated Time:</span>
              <span className="font-bold">
                {calculateWalkingTime(
                  calculateDistance(
                    start.center_x,
                    start.center_y,
                    destination.center_x,
                    destination.center_y
                  )
                )}
              </span>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-700">
            Follow the blue dashed line to walk from{" "}
            <strong>{start.name}</strong> to{" "}
            <strong>{destination.name}</strong>.
          </p>

          <button
            onClick={resetNavigation}
            className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Reset Navigation
          </button>
        </div>
      )}
    </div>
  );
}
