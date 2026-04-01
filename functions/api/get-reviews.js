export async function onRequestGet(context) {
  const { env } = context;
  try {
    const result = await env.DB.prepare(
      'SELECT name, country, rating, review, created_at FROM reviews ORDER BY created_at DESC LIMIT 50'
    ).all();

    return new Response(JSON.stringify({ reviews: result.results || [] }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ reviews: [], error: error.message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
