import { useEffect, useState } from "react";


export default function CampusMap() {
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    const { data, error } = await supabase
      .from("locations")
      .select("*");

    if (!error) setLocations(data);
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">
        📍 Campus Map & Navigation
      </h1>

      {/* Map Container */}
      <div className="relative w-full max-w-6xl mx-auto">
        <img
          src="./public/campusmap.jpg"
          alt="Campus Map"
          className="w-full rounded-lg shadow"
        />

        {/* Hotspots from Supabase */}
        {locations.map((loc) => (
          <button
            key={loc.id}
            className="absolute border-2 border-transparent hover:border-red-500"
            style={{
              top: loc.top,
              left: loc.left,
              width: loc.width,
              height: loc.height,
            }}
            onClick={() => setSelected(loc)}
          />
        ))}
      </div>

      {/* Info Panel */}
      {selected && (
        <div className="mt-4 bg-white p-4 rounded shadow max-w-md mx-auto">
          <h2 className="text-xl font-semibold">{selected.name}</h2>
          <p className="text-gray-600 mt-2">
            {selected.description}
          </p>
          <button
            onClick={() => setSelected(null)}
            className="mt-3 px-4 py-2 bg-red-500 text-white rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
