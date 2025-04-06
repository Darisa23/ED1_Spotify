const axios = require('axios');
const { getToken, getTracksFromPlaylist, getTrackDetails, getImagenArtista } = require('../services/spotifyService');
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

//const PLAYLIST_ID = '083NlJ8KZ8VEPhYuR7Oxf4';

async function generarDatos(req, res) {
    try {
        const playlistId = req.query.playlistId;
        if (!playlistId) {
            return res.status(400).json({ error: 'Falta el playlistId' });
        }

      const token = await getToken();
      const tracksBasic = await getTracksFromPlaylist(playlistId, token);
      
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

async function getArtistaMasRepetido(req, res) {
    try {
        const txtPath = path.join('output', 'datos.txt');
        const resultado = artistaMasRepetido(txtPath);
    
        const token = await getToken();
        const url = `https://api.spotify.com/v1/artists/${resultado.id}`;
    
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
    
        const imagen = response.data.images?.[0]?.url || null;
    
        res.json({
          ...resultado,
          imagen
        });
      } catch (error) {
        console.error('Error obteniendo artista con imagen:', error.message);
        res.status(500).json({ error: 'Error obteniendo la información del artista' });
      }
}


async function getArtistaConMasPopularidad(req, res) {
    try {
      const txtPath = path.join('output', 'datos.txt');
      const resultado = artistaConMasPopularidad(txtPath); 
  
      const token = await getToken();
      const url = `https://api.spotify.com/v1/artists/${resultado.id}`;
  
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const imagen = response.data.images?.[0]?.url || null;
  
      res.json({
        ...resultado,
        imagen
      });
    } catch (error) {
      console.error('Error obteniendo artista popular con imagen:', error.message);
      res.status(500).json({ error: 'Error obteniendo la información del artista' });
    }
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
  async function getAnalisisCompleto(req, res) {
    try {
      const txtPath = path.join('output', 'datos.txt');
  
      const topArtista = artistaMasRepetido(txtPath);
      const popularArtista = artistaConMasPopularidad(txtPath);
      const cancionesOrdenadas = cancionesOrdenadasPorPopularidad(txtPath);
      const cancionesPromedio = cancionesSuperanPromedio(txtPath);
      const tamanoPromedio = tamañoPromedioBytesPorRegistro(txtPath);
  
      // Obtener imagen del artista más repetido
      const token = await getToken();
      const imagenData = await getImagenArtista(topArtista.artista_id, token);
  
      topArtista.imagen = imagenData;
  
      res.json({
        artista_mas_repetido: topArtista,
        artista_con_mas_popularidad: popularArtista,
        canciones_ordenadas_por_popularidad: cancionesOrdenadas,
        canciones_que_superan_promedio: cancionesPromedio,
        tamaño_promedio_bytes: tamanoPromedio
      });
    } catch (error) {
      console.error('Error al obtener análisis completo:', error);
      res.status(500).json({ error: 'Error al obtener análisis completo' });
    }
  }
  

module.exports = {
  generarDatos,
  getArtistaMasRepetido,
  getArtistaConMasPopularidad,
  getCancionesQueSuperanPromedio,
  getCancionesOrdenadasPorPopularidad,
  getTamañoPromedioBytesPorRegistro,
  getPlaylistsUsuario,
  getAnalisisCompleto
};
