import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import AppRouter from "./routes/AppRouter";
import api from "./services/api";

function App() {
  const { isSignedIn, getToken, isLoaded } = useAuth();
  const { user } = useUser();
  const [isSynced, setIsSynced] = useState(false);
  const [dbRole, setDbRole] = useState(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setIsSynced(true);
      return;
    }

    const sincronizar = async () => {
      try {
        const token = await getToken();
        const { data } = await api.post(
          "/auth/login",
          {
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setDbRole(data.user?.role ?? "user");
      } catch (error) {
        console.error("Error sincronizando usuario:", error);
      } finally {
        setIsSynced(true);
      }
    };

    sincronizar();
  }, [isLoaded, isSignedIn]);

  if (!isSynced) return null;

  return (
    <BrowserRouter>
      <AppRouter dbRole={dbRole} />
    </BrowserRouter>
  );
}

export default App;
