// api/chat/completions.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  // Разрешенные origin — оставь только Janitor (и localhost для теста, если нужно)
  const allowed = ['https://app.janitor.ai', 'http://localhost:3000'];
  const origin = req.headers.origin;
  if (origin && !allowed.includes(origin)) {
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

    const text = await resp.text();
    res.status(resp.status)
       .set('content-type', resp.headers.get('content-type') || 'application/json')
       .send(text);
  } catch (err) {
    console.error('Proxy error', err);
    res.status(500).json({ error: 'Proxy failed', detail: err.message });
  }
}
