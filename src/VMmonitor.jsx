import React, { useState, useEffect } from "react";

const USER_POOL = [
  { id: "u1", name: "Avocado" },
  { id: "u2", name: "Blueberry" },
  { id: "u3", name: "Cranberry" },
  { id: "u4", name: "Dewberry" },
  { id: "u5", name: "Elderberry" },
];

export default function VMMonitorSimple() {
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchState = async () => {
    try {
      const res = await fetch("/api/state");
      const data = await res.json();
      setStatus(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchState();
    const timer = setInterval(fetchState, 3000);
    return () => clearInterval(timer);
  }, []);

  const toggle = async (id) => {
    try {
      await fetch("/api/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchState();
    } catch (err) {
      console.error(err);
    }
  };

  const onlineCount = Object.values(status).filter(Boolean).length;
  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Arial, sans-serif",
    }}>
      <div style={{
        width: "300px",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        padding: "20px",
        textAlign: "center",
      }}>
        <h2 style={{ marginBottom: "16px" }}>VM User Monitor</h2>
        <p style={{ fontSize: "14px", color: "#555", marginBottom: "16px" }}>
          Currently Online: {onlineCount} / {USER_POOL.length}
        </p>
        {USER_POOL.map((u) => (
          <button
            key={u.id}
            onClick={() => toggle(u.id)}
            style={{
              width: "100%",
              height: "45px",
              margin: "6px 0",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              backgroundColor: status[u.id] ? "#3b82f6" : "#e2e8f0",
              color: status[u.id] ? "white" : "black",
              fontSize: "16px",
              transition: "0.2s",
            }}
          >
            {u.name} — {status[u.id] ? "Online" : "Offline"}
          </button>
        ))}
      </div>
    </div>
  );
}
