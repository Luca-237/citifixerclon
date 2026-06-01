import MapView from "@/components/map/MapView";

export default function LocationPanel({ location, mapClassName = "w-full h-44 rounded-2xl z-0" }) {
  return (
    <div className="flex flex-col gap-2">
      <MapView lat={location?.lat} lng={location?.lng} interactive className={mapClassName} />
      <p className="text-sm text-gray-700 font-medium">
        {location?.address || "Dirección no disponible"}
      </p>
      {location?.lat && (
        <p className="text-xs text-gray-400">
          {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
        </p>
      )}
    </div>
  );
}
