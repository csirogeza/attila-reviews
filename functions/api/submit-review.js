export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const formData = await request.formData();
    const name = formData.get('name')?.trim();
    const rating = parseInt(formData.get('rating'));
    const reviewText = formData.get('review')?.trim();
    const country = formData.get('country')?.trim() || null;

    if (!name || !rating || rating < 1 || rating > 5 || !reviewText || reviewText.length < 3) {
      return new Response(JSON.stringify({ error: 'Invalid data' }), { status: 400 });
    }
    if (name.length > 50 || reviewText.length > 1000) {
      return new Response(JSON.stringify({ error: 'Too long' }), { status: 400 });
    }

    await env.DB.prepare(
      'INSERT INTO reviews (name, country, rating, review, created_at) VALUES (?, ?, ?, ?, datetime("now"))'
    ).bind(name, country, rating, reviewText).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
