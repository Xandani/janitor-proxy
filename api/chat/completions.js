// api/chat/completions.js
// Для Vercel / Next API routes. Node 18+ поддерживает global fetch.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  // Настрой allowedOrigins под Janitor и, возможно, localhost для теста
  const allowedOrigins = ['https://app.janitor.ai', 'http://localhost:3000'];
  const origin = req.headers.origin;
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  try {
    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });

    const data = await resp.text(); // иногда полезно текстом пропускать
    res.status(resp.status).set('content-type', resp.headers.get('content-type') || 'application/json').send(data);
  } catch (err) {
    console.error('Proxy error', err);
    res.status(500).json({ error: 'Proxy failed', detail: err.message });
  }
}
