import { useClerk } from "@clerk/clerk-react";

function Home() {
  const { signOut } = useClerk();

  return (
    <div>
      <h1>Dashboard ciudadano</h1>
      <button onClick={() => signOut()}>Cerrar sesión</button>
    </div>
  );
}
export default Home;
