// Saves the National Weather Service forecast for Mission Bay to src/data/weather.json.
// If the service is unreachable the build carries on and the site simply hides the weather.
import { writeFile } from 'node:fs/promises';

const POINT = 'https://api.weather.gov/points/37.7249,-122.1561';
const headers = { 'User-Agent': 'MissionBayNews/1.0 (editor@missionbaynews.us)', Accept: 'application/geo+json' };

async function getJson(url) {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

try {
  const point = await getJson(POINT);
  const forecast = await getJson(point.properties.forecast);
  const periods = forecast.properties.periods.slice(0, 2).map((p) => ({
    name: p.name,
    temperature: p.temperature,
    unit: p.temperatureUnit,
    summary: p.shortForecast,
  }));
  await writeFile('src/data/weather.json', JSON.stringify({ generatedAt: new Date().toISOString(), periods }, null, 2));
  console.log(`Weather: ${periods.map((p) => `${p.name} ${p.temperature}°${p.unit} ${p.summary}`).join(' | ')}`);
} catch (err) {
  console.log(`Weather unavailable (${err.message}); the Today strip will skip it.`);
  await writeFile('src/data/weather.json', JSON.stringify({ generatedAt: null, periods: [] }, null, 2));
}
