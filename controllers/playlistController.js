const axios = require('axios');
const { getToken, getTracksFromPlaylist, getTrackDetails } = require('../services/spotifyService');
const {
  crearArchivoSecuencial,
  artistaMasRepetido,
  artistaConMasPopularidad,
  cancionesSuperanPromedio,
  cancionesOrdenadasPorPopularidad,
  tamañoPromedioBytesPorRegistro
} = require('../services/processingService');

const fs = require('fs');
const path = require('path');

const PLAYLIST_ID = '083NlJ8KZ8VEPhYuR7Oxf4';

async function generarDatos(req, res) {
    try {
      const token = await getToken();
      const tracksBasic = await getTracksFromPlaylist(PLAYLIST_ID, token);
      
      console.log('Tracks básicos recibidos:', tracksBasic.length);
      if (!tracksBasic.length) {
        return res.status(400).json({ error: 'La playlist no tiene canciones o no se encontró' });
      }
  
      const ids = tracksBasic.map(t => t.id);
      const fullTracks = await getTrackDetails(ids, token);
  
      console.log('Primer track:', fullTracks[0]?.name, '-', fullTracks[0]?.artists?.[0]?.name);
  
      const jsonPath = path.join('output', 'full_tracks.json');
      fs.writeFileSync(jsonPath, JSON.stringify(fullTracks, null, 2));
  
      const txtPath = path.join('output', 'datos.txt');
      crearArchivoSecuencial(jsonPath, txtPath);
  
      res.json({ message: 'Datos generados correctamente', tracks: fullTracks.length });
    } catch (error) {
      console.error('Error en generarDatos:', error);
      res.status(500).json({ error: 'Error al generar los datos' });
    }
  }

function getArtistaMasRepetido(req, res) {
  const txtPath = path.join('output', 'datos.txt');
  const resultado = artistaMasRepetido(txtPath);
  res.json(resultado);
}

function getArtistaConMasPopularidad(req, res) {
  const txtPath = path.join('output', 'datos.txt');
  const resultado = artistaConMasPopularidad(txtPath);
  res.json(resultado);
}

function getCancionesQueSuperanPromedio(req, res) {
  const txtPath = path.join('output', 'datos.txt');
  const resultado = cancionesSuperanPromedio(txtPath);
  res.json(resultado);
}

function getCancionesOrdenadasPorPopularidad(req, res) {
  const txtPath = path.join('output', 'datos.txt');
  const resultado = cancionesOrdenadasPorPopularidad(txtPath);
  res.json(resultado);
}

function getTamañoPromedioBytesPorRegistro(req, res) {
  const txtPath = path.join('output', 'datos.txt');
  const resultado = tamañoPromedioBytesPorRegistro(txtPath);
  res.json({ tamañoPromedio: resultado });
}


async function getPlaylistsUsuario(req, res) {
    try {
      const { userId } = req.params;
      const token = await getToken();
      const url = `https://api.spotify.com/v1/users/${userId}/playlists`;
  
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const playlists = response.data.items.map(p => ({
        id: p.id,
        name: p.name,
        tracks: p.tracks.total,
        image: p.images[0]?.url || null,
      }));
  
      res.json({ playlists });
    } catch (error) {
      console.error('Error al obtener playlists:', error);
      res.status(500).json({ error: 'No se pudieron obtener las playlists' });
    }
  }
  

module.exports = {
  generarDatos,
  getArtistaMasRepetido,
  getArtistaConMasPopularidad,
  getCancionesQueSuperanPromedio,
  getCancionesOrdenadasPorPopularidad,
  getTamañoPromedioBytesPorRegistro,
  getPlaylistsUsuario
};
