const express = require('express');
const {
  generarDatos,
  getArtistaMasRepetido,
  getArtistaConMasPopularidad,
  getCancionesQueSuperanPromedio,
  getCancionesOrdenadasPorPopularidad,
  getTamañoPromedioBytesPorRegistro,
  getPlaylistsUsuario,
  getAnalisisCompleto
} = require('../controllers/playlistController');

const router = express.Router();
router.get('/usuario/:userId/playlists', getPlaylistsUsuario);
router.get('/generar', generarDatos);
router.get('/artista-top', getArtistaMasRepetido);
router.get('/artista-popular', getArtistaConMasPopularidad);
router.get('/canciones-mayores-promedio', getCancionesQueSuperanPromedio);
router.get('/canciones-ordenadas', getCancionesOrdenadasPorPopularidad);
router.get('/tamano-promedio', getTamañoPromedioBytesPorRegistro);
router.get('/analisis-completo', getAnalisisCompleto);
module.exports = router;

