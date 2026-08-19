export default async function handler(req, res) {
  const subreddit = req.query.subreddit || 'technology';
  const cleanSub = subreddit.trim().replace(/^r\//i, '').replace(/[^a-zA-Z0-9_]/g, '');

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const accessToken = process.env.VITE_REDDIT_ACCESS_TOKEN || process.env.REDDIT_ACCESS_TOKEN;
  const clientId = process.env.VITE_REDDIT_CLIENT_ID || process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.VITE_REDDIT_CLIENT_SECRET || process.env.REDDIT_CLIENT_SECRET;

  // Method A: Direct Access Token (e.g. from Devvit login token)
  if (accessToken) {
    try {
      const oauthRes = await fetch(`https://oauth.reddit.com/r/${cleanSub}/hot?limit=50&raw_json=1`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'web:subredit-vibe-check:v0.0.1 (by /u/Kushagra9308)'
        }
      });

      if (oauthRes.ok) {
        const data = await oauthRes.json();
        return res.status(200).json(data);
      }
    } catch (err) {
      console.warn('Vercel Bearer token fetch error:', err);
    }
  }

  // Method B: Client ID & Secret Credentials
  if (clientId && clientSecret) {
    try {
      const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      const tokenRes = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'SubredditVibeCheck/1.0.0 (by /u/VibeCheckerApp)'
        },
        body: 'grant_type=client_credentials'
      });

      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        if (tokenData.access_token) {
          const oauthRes = await fetch(`https://oauth.reddit.com/r/${cleanSub}/hot?limit=50&raw_json=1`, {
            headers: {
              'Authorization': `Bearer ${tokenData.access_token}`,
              'User-Agent': 'SubredditVibeCheck/1.0.0 (by /u/VibeCheckerApp)'
            }
          });

          if (oauthRes.ok) {
            const data = await oauthRes.json();
            return res.status(200).json(data);
          }
        }
      }
    } catch (err) {
      console.warn('Vercel serverless OAuth error:', err);
    }
  }

  return res.status(200).json({
    kind: 'Listing',
    data: { children: [] }
  });
}
