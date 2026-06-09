import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationsByIncident,
} from "@/services/api";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // Cargar historial inicial — merge con notificaciones ya recibidas por socket
    getNotifications()
      .then(({ data }) => {
        if (!Array.isArray(data)) return;
        setNotifications((prev) => {
          const ids = new Set(prev.map((n) => n._id));
          return [...prev, ...data.filter((n) => !ids.has(n._id))];
        });
      })
      .catch(() => {});

    // Conectar socket
    const socket = io(import.meta.env.VITE_API_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect",            ()    => console.log("[socket] conectado:", socket.id));
    socket.on("connect_error",      (err) => console.warn("[socket] error de conexión:", err.message));
    socket.on("disconnect",         ()    => console.log("[socket] desconectado"));
    socket.on("notification", (noti) => {
      setNotifications((prev) => [noti, ...prev]);
      toast.info(noti.message, { duration: 5000 });
    });

    return () => socket.disconnect();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  const markByIncident = async (incidentId) => {
    try {
      await markNotificationsByIncident(incidentId);
      setNotifications((prev) =>
        prev.map((n) =>
          String(n.incidentId) === String(incidentId) ? { ...n, isRead: true } : n
        )
      );
    } catch {}
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, markByIncident }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  return useContext(NotificationContext);
}
