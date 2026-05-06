import { useClerk } from "@clerk/clerk-react";

function AdminDashboard() {
  const { signOut } = useClerk();

  return (
    <div>
      <h1>Panel Admin</h1>
      <button onClick={() => signOut()}>Cerrar sesión</button>
    </div>
  );
}
export default AdminDashboard;