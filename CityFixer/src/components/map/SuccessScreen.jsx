import { CheckCircle2 } from "lucide-react";

export default function SuccessScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 px-6">
      <CheckCircle2 size={52} className="text-green-500" strokeWidth={1.5} />
      <p className="text-lg font-bold text-azul-oscuro">¡Reporte enviado!</p>
      <p className="text-sm text-gray-400 text-center">
        Tu incidente fue registrado correctamente. Gracias por contribuir.
      </p>
    </div>
  );
}
