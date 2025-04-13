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

// Obtener tracks de una playlist pública:
async function getTracksFromPlaylist(playlistId, token) {
  const limit = 100; // máximo por llamada
  const urlBase = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

  // Primera llamada para saber cuántas hay
  const firstRes = await axios.get(`${urlBase}?limit=${limit}&offset=0`, {
    headers: { Authorization: 'Bearer ' + token }
  });

  const total = firstRes.data.total;
  const totalCalls = Math.ceil(total / limit);
  const promises = [];

  // Generar todas las llamadas en paralelo
  for (let i = 0; i < totalCalls; i++) {
    const offset = i * limit;
    promises.push(
      axios.get(`${urlBase}?limit=${limit}&offset=${offset}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
    );
  }

  const results = await Promise.all(promises);

  // Unir todos los tracks
  const tracks = results.flatMap(res =>
    res.data.items.map(item => ({
      id: item.track.id,
      name: item.track.name,
      artist: item.track.artists.map(a => a.name).join('| ')
    }))
  );

  return tracks;
}


// Obtener detalles de varias canciones por ID
async function getTrackDetails(trackIds, token) {
  const batches = [];
  const limit = 50;

  for (let i = 0; i < trackIds.length; i += limit) {
    const batch = trackIds.slice(i, i + limit);
    const ids = batch.join(',');
    batches.push(
      axios.get(`https://api.spotify.com/v1/tracks?ids=${ids}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
    );
  }

  const responses = await Promise.all(batches);

  return responses.flatMap(res =>
    res.data.tracks.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map(a => a.name).join('|'),
      artist_ids: track.artists.map(a => a.id).join('|'),
      popularity: track.popularity,
      duration_ms: track.duration_ms,
      image: track.album.images?.[1]?.url || null
    }))
  );
}

async function getImagenArtista(artistId, token) {
  const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data.images?.[0]?.url || null;
}
//  Exportar todo
module.exports = {
  getToken,
  getTracksFromPlaylist,
  getTrackDetails,
  getImagenArtista
};
