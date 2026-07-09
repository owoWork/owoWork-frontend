import { useState, useEffect, useCallback, useRef } from "react";
import { fetchDashboardMetrics, DashboardMetrics } from "../data/mockDashboard";

const REFRESH_INTERVAL = 30_000; // 30 seconds

export type DashboardState = {
  metrics: DashboardMetrics | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
  countdown: number; // seconds until next auto-refresh
};

export function useDashboard(): DashboardState {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL / 1000);

  const pollingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async (showFullLoader = false) => {
    if (showFullLoader) setLoading(true);
    setError(null);

    try {
      const data = await fetchDashboardMetrics();
      setMetrics(data);
      setLastUpdated(new Date());
      setCountdown(REFRESH_INTERVAL / 1000);
    } catch (e) {
      setError("Failed to load dashboard data. Will retry shortly.");
    } finally {
      if (showFullLoader) setLoading(false);
    }
  }, []);

  const scheduleNext = useCallback(() => {
    if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);
    pollingTimerRef.current = setTimeout(() => {
      load(false);
      scheduleNext();
    }, REFRESH_INTERVAL);
  }, [load]);

  // Initial load
  useEffect(() => {
    load(true).then(() => scheduleNext());
    return () => {
      if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);
    };
  }, [load, scheduleNext]);

  // Countdown ticker
  useEffect(() => {
    countdownTimerRef.current = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, []);

  const refresh = useCallback(() => {
    if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);
    load(false).then(() => scheduleNext());
  }, [load, scheduleNext]);

  return { metrics, loading, error, lastUpdated, refresh, countdown };
}
