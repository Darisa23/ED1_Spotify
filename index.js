const express = require('express');
const cors = require('cors');
const playlistRoutes = require('./routes/playlistRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', playlistRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
