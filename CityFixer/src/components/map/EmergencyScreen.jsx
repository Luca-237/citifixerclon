import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmergencyScreen({ message, onDismiss }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4 px-6 text-center">
      <AlertCircle size={60} className="text-red-600 animate-pulse" strokeWidth={1.5} />
      <p className="text-xl font-black text-red-600 uppercase tracking-wide">¡Emergencia Detectada!</p>
      <p className="text-sm font-medium text-gray-700 bg-red-50 p-4 rounded-xl border border-red-100">
        {message}
      </p>
      <Button
        onClick={onDismiss}
        className="mt-4 w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl"
      >
        Entendido, llamaré a emergencias
      </Button>
    </div>
  );
}
