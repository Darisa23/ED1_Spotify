const fs = require('fs');
const path = require('path');
const getToken = require('../services/spotifyService').getToken;
const { getTracksFromPlaylist, getTrackDetails } = require('../services/spotifyService');
const { crearArchivoSecuencial, artistaMasRepetido, tamañoPromedioBytesPorRegistro,cancionesSuperanPromedio,cancionesOrdenadasPorPopularidad, artistaConMasPopularidad } = require('../services/processingService');

// ID de la playlist
const PLAYLIST_ID = '31au465lpdbtxvbfhpbdveyg5r4m'; 

async function generarTodo() {
  try {
    // Paso 1: Obtener token y datos
    const token = await getToken();
    const tracksBasic = await getTracksFromPlaylist(PLAYLIST_ID, token);
    const trackIds = tracksBasic.map(t => t.id);
    const fullTracks = await getTrackDetails(trackIds, token);

    // Paso 2: Guardar el JSON completo
    const jsonPath = path.join(__dirname, '../output/full_tracks.json');
    fs.writeFileSync(jsonPath, JSON.stringify(fullTracks, null, 2));
    console.log('JSON generado con detalles de canciones.');

    // Crear archivo de texto desde el JSON
    const txtPath = path.join(__dirname, '../output/datos.txt');
    crearArchivoSecuencial(jsonPath, txtPath);
    console.log('Archivo TXT generado desde JSON.');

    // Encontrar artista más repetido
    const resultado = artistaMasRepetido(txtPath);
    console.log('Artista más repetido:', resultado);
    //Encontrar artista con más popularidad
    const resultado2= artistaConMasPopularidad(txtPath);
    console.log('Artista con más popularidad:', resultado2);
    //Conocer tamaño promedio por registro
    const resultado3=tamañoPromedioBytesPorRegistro(txtPath);
    console.log('Tamaño promedio por registro:', resultado3," Bytes");
    //Encontrar canciones con duración mayor al promedio
    const resultado4= cancionesSuperanPromedio(txtPath);
    console.log('Artista con más popularidad:', resultado4);
    //Ordenar canciones por popularidad
    const resultado5= cancionesOrdenadasPorPopularidad(txtPath);
    console.log('Canciones ordenadas por popularidad:', resultado5);
  } catch (err) {
    console.error('Error en el proceso:', err);
  }
}

generarTodo();
