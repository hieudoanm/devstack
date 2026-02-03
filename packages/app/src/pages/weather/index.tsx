import { Divider } from '@countries/components/Divider';
import { Glass } from '@countries/components/Glass';
import { Linear } from '@countries/components/Linear';
import { Navbar } from '@countries/components/Navbar';
import { useQueries } from '@tanstack/react-query';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';

const timezones = [
  {
    label: 'Los Angeles',
    tz: 'America/Los_Angeles',
    lat: 34.0522,
    lon: -118.2437,
  },
  { label: 'Dallas', tz: 'America/Chicago', lat: 32.7767, lon: -96.797 },
  { label: 'New York', tz: 'America/New_York', lat: 40.7128, lon: -74.006 },
  { label: 'London', tz: 'Europe/London', lat: 51.5072, lon: -0.1276 },
  { label: 'Frankfurt', tz: 'Europe/Berlin', lat: 50.1109, lon: 8.6821 },
  { label: 'Paris', tz: 'Europe/Paris', lat: 48.8566, lon: 2.3522 },
  { label: 'Helsinki', tz: 'Europe/Helsinki', lat: 60.1695, lon: 24.9354 },
  { label: 'Dubai', tz: 'Asia/Dubai', lat: 25.2048, lon: 55.2708 },
  { label: 'Bangkok', tz: 'Asia/Bangkok', lat: 13.7563, lon: 100.5018 },
  { label: 'Singapore', tz: 'Asia/Singapore', lat: 1.3521, lon: 103.8198 },
  { label: 'Tokyo', tz: 'Asia/Tokyo', lat: 35.6895, lon: 139.6917 },
  { label: 'Sydney', tz: 'Australia/Sydney', lat: -33.8688, lon: 151.2093 },
];

const weatherCodeToText = (code: number): string => {
  const map: Record<number, string> = {
    0: '☀️ Clear sky',
    1: '🌤️ Mainly clear',
    2: '⛅ Partly cloudy',
    3: '☁️ Overcast',
    45: '🌫️ Fog',
    48: '🌫️ Rime fog',
    51: '🌦️ Light drizzle',
    53: '🌦️ Moderate drizzle',
    55: '🌧️ Dense drizzle',
    56: '🌧️ Freezing drizzle',
    57: '🌧️ Heavy freezing drizzle',
    61: '🌧️ Light rain',
    63: '🌧️ Moderate rain',
    65: '🌧️ Heavy rain',
    66: '🌧️ Light freezing rain',
    67: '🌧️ Heavy freezing rain',
    71: '❄️ Light snow',
    73: '❄️ Moderate snow',
    75: '❄️ Heavy snow',
    77: '🌨️ Snow grains',
    80: '🌧️ Light rain showers',
    81: '🌧️ Moderate showers',
    82: '🌧️ Heavy showers',
    85: '🌨️ Light snow showers',
    86: '🌨️ Heavy snow showers',
    95: '⛈️ Thunderstorm',
    96: '⛈️ Thunderstorm with hail',
    99: '🌩️ Heavy storm with hail',
  };
  return map[code] || '❓ Unknown';
};

const getTimeInZone = (tz: string) =>
  new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: tz,
  }).format(new Date());

const TimeZonesPage: NextPage = () => {
  const [times, setTimes] = useState(() =>
    timezones.map(({ tz }) => getTimeInZone(tz)),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimes(timezones.map(({ tz }) => getTimeInZone(tz)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const weatherQueries = useQueries({
    queries: timezones.map(({ lat, lon }) => ({
      queryKey: ['open-meteo', lat, lon],
      queryFn: async () => {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`,
        );
        const data = await res.json();
        return data.current;
      },
      staleTime: 1000 * 60 * 10,
    })),
  });

  return (
    <div className="min-h-screen">
      <Linear.Background />
      <div className="relative z-10 flex flex-col">
        <Navbar />
        <Divider />
        <main className="container mx-auto flex grow flex-col space-y-8 p-8">
          <h1 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
            World Clock & Weather
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
            {timezones.map(({ label }, index) => {
              const weather = weatherQueries[index].data;
              return (
                <Glass.Card key={label}>
                  <div className="flex flex-col justify-between sm:flex-row sm:items-center sm:gap-6">
                    {/* Left: City + Time */}
                    <div>
                      <h2 className="text-lg font-semibold tracking-wide whitespace-nowrap text-neutral-200">
                        {label}
                      </h2>
                      <p className="mt-1 font-mono text-xl font-medium tabular-nums">
                        {times[index]}
                      </p>
                    </div>
                    {/* Right: Weather */}
                    <div className="mt-4 text-right text-sm sm:mt-0">
                      {weather ? (
                        <>
                          <p className="text-neutral-300">
                            🌡️{' '}
                            <span className="font-medium">
                              {weather.temperature_2m}°C
                            </span>
                          </p>
                          <p className="whitespace-nowrap text-neutral-400">
                            {weatherCodeToText(weather.weather_code)}
                          </p>
                        </>
                      ) : (
                        <p className="text-neutral-500 italic">
                          Loading weather...
                        </p>
                      )}
                    </div>
                  </div>
                </Glass.Card>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TimeZonesPage;
