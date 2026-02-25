import faqs from '../../../data/faqs.json';

export async function POST(req) {
  try {
    const { message } = await req.json();
    const q = (message || '').toLowerCase();
    if (!q) {
      return new Response(JSON.stringify({ answers: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Primero busca un match exacto
    const exact = faqs.filter(f => f.question.toLowerCase() === q);
    if (exact.length > 0) {
      return new Response(JSON.stringify({ answers: exact }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Si no hay match exacto, hace un scoring mejorado por tokens
    const stopwords = [ // Lista de stopwords comunes
      "el", "la", "un", "una", "y", "o", "de", "a", "en", "on", "para", "con", "es", "son", "era", "eran", "por", "como", "desde", "pero", "yo", "mi", "mí", "tú", "tu", "nosotros", "nuestro", "nuestra", "entonces", "si", "sin"
    ];
    const tokens = q.split(/\W+/)
      .filter(Boolean)
      .filter(t => !stopwords.includes(t));

    const scored = faqs
      .map((f) => {
        const question = f.question.toLowerCase();
        const answer = f.answer.toLowerCase();
        const tags = (f.tags || []).map(t => t.toLowerCase()).join(' ');
        let score = 0;
        tokens.forEach((t) => {
          // Peso: pregunta=3, tags=2, respuesta=1
          if (question.includes(t)) score += 3;
          if (tags.includes(t)) score += 2;
          if (answer.includes(t)) score += 1;
        });
        return { ...f, score };
      })
      .filter((f) => f.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    if (scored.length === 0) {
      return new Response(JSON.stringify({ answers: faqs.slice(0, 3) }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ answers: scored }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ faqs }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
