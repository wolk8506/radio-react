import { useEffect, useState } from 'react';
import { radioService } from './radioService';

// Опрашивает бэкенд и возвращает map: id станции -> { id, name, title, artist, track, updatedAt }
export const useRadioNowPlaying = (intervalMs = 15000) => {
  const [map, setMap] = useState({});

  useEffect(() => {
    let mounted = true;

    const load = () => {
      radioService
        .getNowPlaying()
        .then(res => {
          if (!mounted) return;
          const next = {};
          (res || []).forEach(s => {
            next[s.id] = s;
          });
          setMap(next);
        })
        .catch(() => {});
    };

    load();
    const timer = setInterval(load, intervalMs);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [intervalMs]);

  return map;
};
