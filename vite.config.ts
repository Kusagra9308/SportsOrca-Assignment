import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import os from 'os';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'reddit-live-token-proxy',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          // Proxy Live Reddit Request using Devvit User Token
          if (req.url && req.url.startsWith('/api/live_reddit')) {
            const urlObj = new URL(req.url, 'http://localhost:5173');
            const subreddit = urlObj.searchParams.get('subreddit') || 'technology';
            const cleanSub = subreddit.trim().replace(/^r\//i, '').replace(/[^a-zA-Z0-9_]/g, '');

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');

            try {
              // Read Devvit token from user profile (~/.devvit/token)
              const tokenPath = path.join(os.homedir(), '.devvit', 'token');
              if (fs.existsSync(tokenPath)) {
                const fileContent = fs.readFileSync(tokenPath, 'utf8');
                const fileObj = JSON.parse(fileContent);
                let tokenObj: any;
                if (fileObj.token.startsWith('{')) {
                  tokenObj = JSON.parse(fileObj.token);
                } else {
                  tokenObj = JSON.parse(Buffer.from(fileObj.token, 'base64').toString('utf8'));
                }

                if (tokenObj && tokenObj.accessToken) {
                  const targetUrl = `https://oauth.reddit.com/r/${cleanSub}/hot?limit=50&raw_json=1`;
                  const oauthRes = await fetch(targetUrl, {
                    headers: {
                      'Authorization': `Bearer ${tokenObj.accessToken}`,
                      'User-Agent': 'web:subredit-vibe-check:v0.0.1 (by /u/Kushagra9308)'
                    }
                  });

                  if (oauthRes.ok) {
                    const dataText = await oauthRes.text();
                    return res.end(dataText);
                  }
                }
              }
            } catch (tokenErr) {
              console.warn('Devvit token proxy warning:', tokenErr);
            }

            // Fallback JSON if token missing or expired
            return res.end(JSON.stringify({
              kind: 'Listing',
              data: { children: [] }
            }));
          }

          next();
        });
      }
    }
  ],
  server: {
    port: 5173,
    open: true
  }
});
