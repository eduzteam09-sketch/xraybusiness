// Natural Vietnamese Female Voice TTS proxy
// Uses Google's authentic Vietnamese natural speech synthesis with chunking & concatenation
export default async function handler(req: any, res: any) {
  // Allow GET and POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawText =
      (req.query.text as string) ||
      (req.body && req.body.text ? String(req.body.text) : '') ||
      '';

    if (!rawText.trim()) {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    // Clean text: strip markdown characters, bullets, symbols, parentheticals
    const cleanText = rawText
      .replace(/[*_#>`~]/g, '')
      .replace(/\(.*?\)/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/•/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      return res.status(400).json({ error: 'Text after cleaning is empty' });
    }

    // Split text into chunks <= 180 chars preserving sentence / clause boundaries
    const sentences = cleanText.match(/[^.?!,;:\n]+[.?!,;:\n]*/g) || [cleanText];
    const chunks: string[] = [];
    let current = '';

    for (const s of sentences) {
      const trimmed = s.trim();
      if (!trimmed) continue;
      if ((current + ' ' + trimmed).trim().length <= 180) {
        current = (current + ' ' + trimmed).trim();
      } else {
        if (current) chunks.push(current);
        if (trimmed.length > 180) {
          // split overly long clause by word boundaries
          const words = trimmed.split(' ');
          let wordChunk = '';
          for (const w of words) {
            if ((wordChunk + ' ' + w).trim().length <= 180) {
              wordChunk = (wordChunk + ' ' + w).trim();
            } else {
              if (wordChunk) chunks.push(wordChunk);
              wordChunk = w;
            }
          }
          if (wordChunk) chunks.push(wordChunk);
          current = '';
        } else {
          current = trimmed;
        }
      }
    }
    if (current) chunks.push(current);

    // Limit to max 4 chunks (~700 chars) for responsive interview speech
    const activeChunks = chunks.slice(0, 4);

    const buffers: Buffer[] = [];
    for (const chunk of activeChunks) {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(
        chunk
      )}`;
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'audio/mpeg, audio/*;q=0.9',
        },
      });

      if (response.ok) {
        const arrayBuf = await response.arrayBuffer();
        buffers.push(Buffer.from(arrayBuf));
      } else {
        console.warn(`TTS upstream error: ${response.status} for chunk "${chunk.slice(0, 30)}..."`);
      }
    }

    if (buffers.length === 0) {
      return res.status(502).json({ error: 'Failed to fetch Vietnamese audio stream' });
    }

    const combinedBuffer = Buffer.concat(buffers);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', combinedBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return res.status(200).send(combinedBuffer);
  } catch (error: any) {
    console.error('Error in /api/tts:', error);
    return res.status(500).json({ error: error.message || 'Internal server error in TTS' });
  }
}
