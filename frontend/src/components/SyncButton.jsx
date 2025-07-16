import { useState } from "react";

function SyncButton({ onSyncComplete }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setError(null);

    try {
      const response = await fetch("/api/sync", { method: "POST" });
      if (!response.ok) throw new Error("Sync failed");
      onSyncComplete?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div>
      <button onClick={handleSync} disabled={isSyncing} className="sync-button">
        {isSyncing ? "Синхронизируем..." : "Синхронизировать с GitHub"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default SyncButton;
