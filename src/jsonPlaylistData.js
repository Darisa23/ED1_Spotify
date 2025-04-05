//importamos módulo de File System de Node.js. Sirve para leer, escribir, modificar o eliminar archivos
import fs from 'fs'; 
import getToken from './utils/getToken.js';
import { getTracksFromPlaylist, getTrackDetails } from './utils/spotifyUtils.js';

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

