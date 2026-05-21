import { useState } from "react";
import { MapPin, Tag, Calendar, FileText, ImageOff, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { STATUS_STYLES, STATUS_LABELS, capitalize } from "@/lib/incidents";
import { formatDate } from "./IncidentCard";
import MapView from "@/Components/map/MapView";

function PhotoGallery({ photos }) {
  const [lightbox, setLightbox] = useState(null);

  if (!photos?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-2 bg-gray-50 rounded-2xl">
        <ImageOff size={28} className="text-gray-300" />
        <p className="text-xs text-gray-400">Sin fotos adjuntas</p>
      </div>
    );
  }

  return (
    <>
      {photos.length === 1 ? (
        <img
          src={photos[0]}
          alt="foto-1"
          onClick={() => setLightbox(photos[0])}
          className="w-full max-h-64 rounded-2xl object-contain bg-gray-50 cursor-pointer hover:opacity-90 transition-opacity"
        />
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
          {photos.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`foto-${i + 1}`}
              onClick={() => setLightbox(url)}
              className="h-40 w-40 shrink-0 rounded-2xl object-cover cursor-pointer hover:opacity-90 transition-opacity"
            />
          ))}
        </div>
      )}

      <Dialog open={!!lightbox} onOpenChange={() => setLightbox(null)}>
        <DialogContent className="max-w-3xl p-0 bg-black border-none overflow-hidden" aria-describedby={undefined}>
          <img
            src={lightbox}
            alt="foto ampliada"
            className="w-full max-h-[85vh] object-contain"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function IncidentDetailSheet({ incident, open, onOpenChange, actions }) {
  if (!incident) return null;

  const statusKey = incident.status?.name;
  const style     = STATUS_STYLES[statusKey] ?? STATUS_STYLES.pendiente;
  const label     = STATUS_LABELS[statusKey] ?? capitalize(statusKey);
  const location  = incident.location;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="rounded-t-3xl max-h-[92vh] overflow-y-auto p-0 [&::-webkit-scrollbar]:hidden"
      >
        {/* ── Dark header ── */}
        <SheetHeader className="bg-[#292D60] px-5 pt-3 pb-5 text-left rounded-t-3xl">
          {/* Handle (mobile) */}
          <div className="flex justify-center pb-2 md:hidden">
            <div className="w-10 h-1 bg-white/30 rounded-full" />
          </div>

          {/* Title row + close button */}
          <div className="flex items-start gap-3">
            <SheetTitle className="text-lg font-bold text-white leading-snug flex-1">
              {incident.title}
            </SheetTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="shrink-0 mt-0.5 p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Status + meta row */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}>
              {label}
            </span>
            <span className="text-white/20">·</span>
            <div className="flex items-center gap-1.5 text-xs text-white/60">
              <Tag size={12} className="shrink-0" />
              <span>{capitalize(incident.category?.name)}</span>
            </div>
            <span className="text-white/20">·</span>
            <div className="flex items-center gap-1.5 text-xs text-white/60">
              <Calendar size={12} className="shrink-0" />
              <span>{formatDate(incident.createdAt)}</span>
            </div>
          </div>
        </SheetHeader>

        {/* ── Body ── */}
        <div className="px-5 pt-5 pb-8">
          <div className="max-w-5xl mx-auto">

            {/* Desktop: mapa izq + contenido der — Mobile: contenido primero, mapa al final */}
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] gap-y-5 md:gap-y-0">

              {/* ── Columna izquierda: mapa + dirección (solo desktop) ── */}
              <div className="hidden md:flex flex-col gap-3 pr-6">
                <SectionLabel icon={<MapPin size={13} className="text-gray-400" />} label="Ubicación" />
                <MapView
                  lat={location?.lat}
                  lng={location?.lng}
                  interactive={true}
                  className="w-full h-64 rounded-2xl z-0"
                />
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm text-gray-700 font-medium">
                    {location?.address || "Dirección no disponible"}
                  </p>
                  {location?.lat && (
                    <p className="text-xs text-gray-400">
                      {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                    </p>
                  )}
                </div>
              </div>

              {/* Divider vertical (desktop) */}
              <div className="hidden md:block bg-gray-100" />

              {/* ── Columna derecha: descripción + fotos (desktop) / todo en mobile ── */}
              <div className="flex flex-col gap-5 md:pl-6">
                <section>
                  <SectionLabel icon={<FileText size={13} className="text-gray-400" />} label="Descripción" />
                  <p className="text-sm text-gray-600 leading-relaxed mt-2">
                    {incident.description || "Sin descripción."}
                  </p>
                </section>

                <section>
                  <SectionLabel label="Fotos" />
                  <div className="mt-2">
                    <PhotoGallery photos={incident.photos} />
                  </div>
                </section>

                {/* Ubicación solo en mobile (aquí, al final) */}
                <section className="md:hidden">
                  <SectionLabel icon={<MapPin size={13} className="text-gray-400" />} label="Ubicación" />
                  <div className="mt-2 flex flex-col gap-2">
                    <MapView
                      lat={location?.lat}
                      lng={location?.lng}
                      interactive={true}
                      className="w-full h-48 rounded-2xl z-0"
                    />
                    <p className="text-sm text-gray-700 font-medium">
                      {location?.address || "Dirección no disponible"}
                    </p>
                    {location?.lat && (
                      <p className="text-xs text-gray-400">
                        {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                      </p>
                    )}
                  </div>
                </section>
              </div>

            </div>

            {/* Actions slot — admin injects botones de gestión aquí */}
            {actions && (
              <div className="mt-6 pt-5 border-t border-gray-100">
                {actions}
              </div>
            )}

          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SectionLabel({ icon, label }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
    </div>
  );
}
