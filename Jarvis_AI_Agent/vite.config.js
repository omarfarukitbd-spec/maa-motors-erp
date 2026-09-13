import { defineConfig } from 'vite';
import https from 'https';

export default defineConfig({
  base: './',
  server: {
    host: true,
    port: 5180,
    open: false,
    cors: true
  },
  plugins: [
    {
      name: 'tts-proxy',
      configureServer(server) {
        server.middlewares.use('/api/tts', (req, res) => {
          const urlObj = new URL(req.url, 'http://localhost');
          const q = urlObj.searchParams.get('q') || '';
          if (!q) {
            res.writeHead(400);
            res.end('Missing text');
            return;
          }

          const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(q)}&tl=bn&client=tw-ob`;
          const proxyReq = https.get(googleUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
          }, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, {
              'Content-Type': 'audio/mpeg',
              'Access-Control-Allow-Origin': '*',
              'Cache-Control': 'public, max-age=86400'
            });
            proxyRes.pipe(res);
          });

          proxyReq.on('error', (err) => {
            console.error('[TTS Proxy Error]:', err);
            res.writeHead(500);
            res.end('TTS Error');
          });
        });
      }
    }
  ],
  build: {
    outDir: 'dist',
    target: 'esnext'
  }
});
