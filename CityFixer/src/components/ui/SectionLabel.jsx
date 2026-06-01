export default function SectionLabel({ icon, label }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
    </div>
  );
}
