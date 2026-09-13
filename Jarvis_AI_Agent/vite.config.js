import { defineConfig } from 'vite';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

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
      name: 'azure-neural-tts-proxy',
      configureServer(server) {
        server.middlewares.use('/api/tts', async (req, res) => {
          const urlObj = new URL(req.url, 'http://localhost');
          const q = urlObj.searchParams.get('q') || '';
          const voice = urlObj.searchParams.get('voice') || 'bn-BD-PradeepNeural';

          if (!q) {
            res.writeHead(400);
            res.end('Missing text parameter');
            return;
          }

          try {
            const tts = new MsEdgeTTS();
            await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
            const { audioStream } = tts.toStream(q);

            res.writeHead(200, {
              'Content-Type': 'audio/mpeg',
              'Access-Control-Allow-Origin': '*',
              'Cache-Control': 'public, max-age=86400'
            });

            audioStream.pipe(res);
            audioStream.on('error', (err) => {
              console.error('[Neural TTS AudioStream Error]:', err);
              if (!res.headersSent) res.writeHead(500);
              res.end();
            });
          } catch (err) {
            console.error('[Neural TTS Error]:', err);
            if (!res.headersSent) res.writeHead(500);
            res.end('Neural TTS Failed: ' + err.message);
          }
        });
      }
    }
  ],
  build: {
    outDir: 'dist',
    target: 'esnext'
  }
});
