import { Loader2, Shield, ShieldOff } from "lucide-react";

const ROLE_LABELS = { user: "Ciudadano", admin: "Admin", superAdmin: "Super Admin" };
const ROLE_STYLES = {
  superAdmin: "bg-azul-oscuro text-white",
  admin:      "bg-celestito text-white",
  user:       "bg-blanquito text-azul-oscuro",
};

export default function UserCard({ user, roles, isLoading, error, onRoleChange, onBanToggle }) {
  const roleName     = user.role?.name ?? "user";
  const roleStyle    = ROLE_STYLES[roleName] ?? ROLE_STYLES.user;
  const roleLabel    = ROLE_LABELS[roleName] ?? roleName;
  const isSuperAdmin = roleName === "superAdmin";

  return (
    <div className={`bg-white p-5 rounded-[24px] shadow-sm flex flex-col gap-3 border transition-shadow hover:shadow-md ${
      user.isBanned ? "border-red-200" : "border-blanquito/30"
    }`}>

      {/* Avatar + datos */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blanquito/50 flex items-center justify-center text-azul-oscuro font-bold shrink-0 text-sm">
          {user.firstName?.charAt(0)?.toUpperCase() ?? "?"}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-azul-oscuro truncate text-sm">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
        </div>
        {user.isBanned && (
          <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
            Baneado
          </span>
        )}
      </div>

      {/* Error de acción */}
      {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}

      {/* Rol + acciones */}
      <div className="flex items-center justify-between pt-3 border-t border-blanquito/30 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {isSuperAdmin ? (
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${roleStyle}`}>
              {roleLabel}
            </span>
          ) : (
            <select
              value={user.role?._id ?? ""}
              disabled={!!isLoading}
              onChange={(e) => onRoleChange(user._id, e.target.value)}
              className={`text-xs font-bold px-3 py-1 rounded-full border-none outline-none cursor-pointer ${roleStyle}`}
            >
              {roles
                .filter((r) => r.name !== "superAdmin" && r.name !== "ai")
                .map((r) => (
                  <option key={r._id} value={r._id}>
                    {ROLE_LABELS[r.name] ?? r.name}
                  </option>
                ))}
            </select>
          )}
          {isLoading === "role" && <Loader2 size={13} className="animate-spin text-celestito" />}
        </div>

        {!isSuperAdmin && (
          <button
            onClick={() => onBanToggle(user._id, !user.isBanned)}
            disabled={!!isLoading}
            className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full transition-colors disabled:opacity-50 ${
              user.isBanned
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-red-100 text-red-600 hover:bg-red-200"
            }`}
          >
            {isLoading === "ban" ? (
              <Loader2 size={11} className="animate-spin" />
            ) : user.isBanned ? (
              <><ShieldOff size={11} /> Desbanear</>
            ) : (
              <><Shield size={11} /> Banear</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
