import path from 'path';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function geminiInsightsPlugin(envKey: string): Plugin {
  return {
    name: 'gemini-insights-api',
    configureServer(server) {
      server.middlewares.use('/api/ai-insights', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Método não permitido' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const apiKey = process.env.GEMINI_API_KEY || envKey;

            if (!apiKey) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ 
                error: 'GEMINI_API_KEY não configurada no servidor. Configure a chave de API nas definições.' 
              }));
              return;
            }

            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: data.prompt,
            });

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ text: response.text }));
          } catch (err: any) {
            console.error('Gemini API Error in /api/ai-insights:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Erro ao processar análise com Gemini.' }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        geminiInsightsPlugin(env.GEMINI_API_KEY || '')
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
