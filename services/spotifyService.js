require('dotenv').config();
const axios = require('axios');

// Obtener token
async function getToken() {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', process.env.CLIENT_ID);
  params.append('client_secret', process.env.CLIENT_SECRET);

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting token:', error.response.data);
  }
}

// Obtener tracks de una playlist pública
async function getTracksFromPlaylist(playlistId, token) {
  //Cuando usas el endpoint de Spotify para buscar varias canciones por ID, 
  // el límite es de 50 tracks por solicitud, para ahorrarnos trabajo trabajamos 
  //siempre con las 50 primeras de la playlist
  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`;

  const res = await axios.get(url, {
    headers: { Authorization: 'Bearer ' + token }
  });

  const tracks = res.data.items.map(item => ({
    id: item.track.id,
    name: item.track.name,
    artist: item.track.artists.map(a => a.name).join(', ')
  }));

  return tracks;
}

// Obtener detalles de varias canciones por ID
async function getTrackDetails(trackIds, token) {
  const ids = trackIds.join(',');
  const url = `https://api.spotify.com/v1/tracks?ids=${ids}`;

  const res = await axios.get(url, {
    headers: { Authorization: 'Bearer ' + token }
  });

  return res.data.tracks.map(track => ({
    id: track.id,
    name: track.name,
    artist: track.artists.map(a => a.name).join(', '),
    artist_ids: track.artists.map(a => a.id).join(', '),
    popularity: track.popularity,
    duration_ms: track.duration_ms
  }));
}

//  Exportar todo
module.exports = {
  getToken,
  getTracksFromPlaylist,
  getTrackDetails
};
