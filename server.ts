import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check API
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'Hiking Trail Explorer' });
  });

  // Weather Proxy Endpoint (Open-Meteo)
  app.get('/api/weather', async (req, res) => {
    try {
      const { lat, lng } = req.query;
      if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and Longitude required' });
      }

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
      const response = await fetch(url);
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Weather API error' });
      }
      const data = await response.json();
      res.json(data);
    } catch (err) {
      console.error('Weather proxy error:', err);
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  });

  // Vite Middleware or Static Assets
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hiking Trail Explorer server running on http://localhost:${PORT}`);
  });
}

startServer();
