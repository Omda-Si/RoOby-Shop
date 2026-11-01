import { useEffect, useState } from "react";
import { api, readCachedCatalog, writeCachedCatalog } from "../api/client.js";

export function useCatalog(pollMs = 30000) {
  const [data, setData] = useState(() => readCachedCatalog());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(() => !readCachedCatalog());
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    let retryTimer = 0;

    async function load(attempt = 1) {
      try {
        const payload = await api.catalog();
        if (!alive) return;
        setData(payload);
        writeCachedCatalog(payload);
        setError("");
        setLoading(false);
      } catch (err) {
        if (!alive) return;
        if (attempt < 4) {
          retryTimer = window.setTimeout(() => load(attempt + 1), attempt * 1200);
          return;
        }
        setLoading(false);
        setError(err.message || "تعذر فتح المتجر");
      }
    }

    load();
    const timer = window.setInterval(() => load(), pollMs);
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => {
      alive = false;
      window.clearInterval(timer);
      window.clearTimeout(retryTimer);
      window.removeEventListener("focus", onFocus);
    };
  }, [pollMs, tick]);

  return { data, error, loading, refresh: () => setTick((value) => value + 1) };
}
