const express = require('express');
const tripsRouter = require('./routes/trips');

const app = express();
const PORT = 3000;

// Minimal CORS so the Vite dev server (different port) can call this API
// without adding an extra dependency.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/trips', tripsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
