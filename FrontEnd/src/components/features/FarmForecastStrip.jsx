import { Droplets } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getFarmWeather } from '../../api/weatherApi';

// Shows current conditions + a multi-day outlook for a farm's location.
// Renders however many forecast days the weather provider actually returns
// (free-tier plans are often capped below what you might expect), rather
// than assuming a fixed day count.
export const FarmForecastStrip = ({ location }) => {
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    if (!location) {
      setStatus('error');
      return undefined;
    }

    setStatus('loading');
    getFarmWeather(location)
      .then((data) => {
        if (cancelled) return;
        setWeather(data);
        setStatus('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setErrorMessage(err?.response?.data?.message || '');
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [location]);

  if (status === 'loading') {
    return (
      <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5 text-sm text-slate-400 animate-pulse dark:border-slate-700 dark:bg-slate-900">
        Loading weather forecast...
      </div>
    );
  }

  if (status === 'error' || !weather) {
    return (
      <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5 text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900">
        {errorMessage || 'Weather forecast unavailable for this location.'}
      </div>
    );
  }

  const days = weather.dailyForecast || [];

  return (
    <div className="overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white dark:border-slate-700 dark:from-slate-900 dark:to-slate-950">
      {/* Current conditions banner */}
      <div className="flex items-center justify-between gap-4 border-b border-sky-100 bg-white/60 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-center gap-3">
          <span className="text-4xl leading-none">{weather.currentIcon}</span>
          <div>
            <p className="text-2xl font-bold text-slate-800 dark:text-gray-100">
              {Math.round(weather.currentTemp)}&deg;C
            </p>
            <p className="text-xs text-slate-500 dark:text-gray-400">{weather.currentCondition} &middot; {weather.currentHumidity}% humidity</p>
            {weather.resolvedLocation && (
              <p className="mt-0.5 text-[11px] text-slate-400 dark:text-gray-500">
                Showing weather for: {weather.resolvedLocation}
              </p>
            )}
          </div>
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">Right now</p>
      </div>

      {/* Multi-day strip */}
      {days.length > 0 && (
        <div className="grid grid-cols-3 divide-x divide-sky-100 dark:divide-slate-800 sm:grid-cols-3">
          {days.map((d) => (
            <div key={d.date} className="flex flex-col items-center gap-1 px-3 py-4 text-center transition hover:bg-white/60 dark:hover:bg-slate-800/40">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">{d.dayLabel}</p>
              <span className="text-3xl leading-none">{d.icon}</span>
              <p className="line-clamp-2 min-h-[2.2em] px-1 text-[11px] font-medium leading-tight text-slate-600 dark:text-gray-300">
                {d.condition}
              </p>
              <p className="text-sm font-bold text-slate-800 dark:text-gray-100">
                {Math.round(d.high)}&deg;<span className="font-normal text-slate-400">/{Math.round(d.low)}&deg;</span>
              </p>
              <p className="flex items-center gap-1 text-[11px] font-medium text-sky-600 dark:text-sky-400">
                <Droplets className="h-3 w-3" />
                {d.rainChance}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
