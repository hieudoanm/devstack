import countries from '@countries/data/countries.json';
import { NextPage } from 'next';
import { useMemo } from 'react';

type Country = {
  name: string;
  official_name: string;
  region: string;
  subregion: string;
  cca2: string;
  cca3: string;
  flag: string;
  passport_rank: number;
};

const regionBadge: Record<string, string> = {
  Africa: 'badge-primary',
  Americas: 'badge-secondary',
  Antarctic: 'badge-accent',
  Asia: 'badge-success',
  Europe: 'badge-warning',
  Oceania: 'badge-info',
};

const HomePage: NextPage = () => {
  // Example ranking: alphabetical by country name
  const rankedCountries = useMemo(() => {
    return [...(countries as Country[])]
      .filter(({ passport_rank }) => passport_rank)
      .sort((a, b) => {
        if (a.passport_rank === b.passport_rank) {
          return a.name.localeCompare(b.name);
        }
        return a.passport_rank > b.passport_rank ? 1 : -1;
      });
  }, []);

  return (
    <div className="bg-base-200 h-screen p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-3xl font-bold">🌍 Countries Ranking</h1>

        <div className="rounded-box border-base-300 bg-base-100 flex-1 overflow-hidden border">
          <div className="h-full overflow-auto">
            <table className="table-zebra table-sm table">
              <thead className="bg-base-100 sticky top-0 z-10">
                <tr>
                  <th>#</th>
                  <th>Passport Rank</th>
                  <th>Country</th>
                  <th>Code</th>
                  <th>Region</th>
                  <th>Subregion</th>
                </tr>
              </thead>
              <tbody>
                {rankedCountries.map((country, index) => (
                  <tr key={country.cca3}>
                    <th>{index + 1}</th>
                    <td className="font-mono">
                      {country.passport_rank ?? '—'}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{country.flag}</span>
                        <div>
                          <div className="font-bold">{country.name}</div>
                          <div className="text-xs opacity-60">
                            {country.official_name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="flex gap-1">
                        <span className="badge badge-neutral">
                          {country.cca2}
                        </span>
                        <span className="badge badge-neutral">
                          {country.cca3}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className={`badge ${regionBadge[country.region]}`}>
                        {country.region || '—'}
                      </span>
                    </td>

                    <td className="text-sm opacity-80">
                      {country.subregion || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-sm opacity-60">
          Total: {rankedCountries.length} countries
        </p>
      </div>
    </div>
  );
};

export default HomePage;
