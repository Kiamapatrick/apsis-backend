const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample route
const messageRoutes = require('./routes/messages');
app.use('/api/messages', messageRoutes);
app.get('/', (req, res) => {
  res.send('Noventra Backend is running ✅');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
const clientRoutes = require('./routes/clients');
app.use('/api/clients', clientRoutes);

