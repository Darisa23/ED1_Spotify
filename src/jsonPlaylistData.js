import axios from 'axios';
//importamos módulo de File System de Node.js. Sirve para leer, escribir, modificar o eliminar archivos
import fs from 'fs'; 
import getToken from './getToken.js';

//guardamos el id de la playlist que queramos
const PLAYLIST_ID = '3mn4kXt07PEGZFR46h3HhN';

const getTracksFromPlaylist = async (token) => {
    //usamos el endpoint de la playlist
  const url = `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks?limit=50`;

  const res = await axios.get(url, {
    headers: { Authorization: 'Bearer ' + token }
  });
//extraemos los datos de los nombres de las canciones, el artista y el id de la canción
  const tracks = res.data.items.map(item => ({
    id: item.track.id,
    name: item.track.name,
    artist: item.track.artists.map(a => a.name).join(', ')
  }));

  return tracks;
};

const getTrackDetails = async (trackIds, token) => {
//convertimos una lista de IDs en un solo string separado por comas
  const ids = trackIds.join(',');
  //usamos el endpoint de GetTrack
  const url = `https://api.spotify.com/v1/tracks?ids=${ids}`;

  const res = await axios.get(url, {
    headers: { Authorization: 'Bearer ' + token }
  });
//nos retorna los datos esperados
  return res.data.tracks.map(track => ({
    id: track.id,
    name: track.name,
    artist: track.artists.map(a => a.name).join(', '),
    popularity: track.popularity,
    duration_ms: track.duration_ms
  }));
};

const main = async () => {
    //llamamos el token
  const token = await getToken();
  //extraemos la info de las canciones de la playlist
  const tracks = await getTracksFromPlaylist(token);
  //creamos un array solo con los IDs de las canciones para luego usarlos en el endpoint de track
  const ids = tracks.map(t => t.id);
  const trackDetails = await getTrackDetails(ids, token);
//creamos el archivo .json
  fs.writeFileSync('playlist_data.json', JSON.stringify(trackDetails, null, 2));
};

main();

