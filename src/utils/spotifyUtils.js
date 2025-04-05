import axios from 'axios';
//guardamos el id de la playlist que queramos
const PLAYLIST_ID = '3mn4kXt07PEGZFR46h3HhN';

export const getTracksFromPlaylist = async (token) => {
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

export const getTrackDetails = async (trackIds, token) => {
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