import fetch from 'node-fetch';
import fs from 'fs';
import getToken from './getToken.js';

const PLAYLIST_ID = '3mn4kXt07PEGZFR46h3HhN';

const getTracksFromPlaylist = async (token) => {
  const url = `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks?limit=50`;

  const res = await fetch(url, {
    headers: { Authorization: 'Bearer ' + token }
  });
  const data = await res.json();

  const tracks = data.items.map(item => ({
    id: item.track.id,
    name: item.track.name,
    artist: item.track.artists.map(a => a.name).join(', ')
  }));

  return tracks;
};

const getTrackDetails = async (trackIds, token) => {
  const ids = trackIds.join(',');
  const res = await fetch(`https://api.spotify.com/v1/tracks?ids=${ids}`, {
    headers: { Authorization: 'Bearer ' + token }
  });
  const data = await res.json();

  return data.tracks.map(track => ({
    id: track.id,
    name: track.name,
    artist: track.artists.map(a => a.name).join(', '),
    popularity: track.popularity,
    duration_ms: track.duration_ms
  }));
};

const main = async () => {
  const token = await getToken();
  const tracks = await getTracksFromPlaylist(token);
  const ids = tracks.map(t => t.id);
  const trackDetails = await getTrackDetails(ids, token);

  fs.writeFileSync('playlist_data.json', JSON.stringify(trackDetails, null, 2));
  console.log('✅ Archivo creado: playlist_data.json');
};

main();
