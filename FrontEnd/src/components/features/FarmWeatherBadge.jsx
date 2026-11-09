import { Droplets } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getFarmWeather } from '../../api/weatherApi';

// Small inline weather badge for a farm card, keyed off the farm's location string.
export const FarmWeatherBadge = ({ location }) => {
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
      <div className="mt-2 flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-400 dark:text-gray-500 animate-pulse">
        Fetching weather...
      </div>
    );
  }

  if (status === 'error' || !weather) {
    return (
      <div className="mt-2 rounded-xl bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-400 dark:text-gray-500">
        {errorMessage || 'Weather unavailable for this location'}
      </div>
    );
  }

  return (
    <div
      className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-sky-50 dark:bg-slate-800 px-3 py-2 border border-sky-100 dark:border-slate-700"
      title={weather.resolvedLocation ? `Weather shown for: ${weather.resolvedLocation}` : undefined}
    >
      {/* Current */}
      <div className="flex items-center gap-2">
        <span className="text-xl leading-none">{weather.currentIcon}</span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-800 dark:text-gray-100">
            {Math.round(weather.currentTemp)}&deg;C
          </p>
          <p className="text-[11px] text-slate-500 dark:text-gray-400">{weather.currentCondition}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-sky-100 dark:bg-slate-700" />

      {/* Tomorrow */}
      <div className="flex items-center gap-2">
        <span className="text-xl leading-none">{weather.tomorrowIcon}</span>
        <div className="leading-tight text-right">
          <p className="text-[11px] text-slate-500 dark:text-gray-400">Tomorrow</p>
          <p className="flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-gray-200">
            {Math.round(weather.tomorrowHigh)}&deg;/{Math.round(weather.tomorrowLow)}&deg;
            <span className="flex items-center gap-0.5 text-sky-600 dark:text-sky-400">
              <Droplets className="h-3 w-3" />
              {weather.tomorrowRainChance}%
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
