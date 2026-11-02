import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { buildIcs } from '../../lib/calendar';

export async function getStaticPaths() {
  const events = await getCollection('events');
  return events.map((event) => ({ params: { slug: event.id }, props: { event } }));
}

export function GET({ props, site }: APIContext) {
  const { event } = props as { event: Awaited<ReturnType<typeof getCollection<'events'>>>[number] };
  const ics = buildIcs(
    {
      id: event.id,
      title: event.data.title,
      date: event.data.date,
      startTime: event.data.startTime,
      endTime: event.data.endTime,
      location: event.data.location,
      description: event.data.summary,
    },
    site!.href.replace(/\/$/, ''),
  );
  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${event.id}.ics"`,
    },
  });
}
