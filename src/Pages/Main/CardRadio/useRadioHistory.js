import { useEffect, useState } from 'react';
import { radioService } from './radioService';

export const useRadioHistory = (stationId, enabled = false) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !stationId) {
      setHistory([]);
      return;
    }

    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await radioService.getHistory(stationId);
        if (!mounted) return;
        setHistory(res?.history || []);
      } catch (e) {
        if (!mounted) return;
        setError(e);
        setHistory([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [stationId, enabled]);

  return { history, loading, error };
};