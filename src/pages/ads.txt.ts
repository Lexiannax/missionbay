import ads from '../data/ads.json';

// Served at /ads.txt. Stays an empty placeholder until a Google AdSense publisher ID is set in src/data/ads.json.
export function GET() {
  const id = ads.publisherId.replace(/^ca-/, '');
  const body = id ? `google.com, ${id}, DIRECT, f08c47fec0942fa0\n` : '# No ad partners configured yet.\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
