import { getToken } from '../services/spotifyService.js';
import axios from 'axios';

const testToken = async () => {
  try {
    const token = await getToken();
    console.log('✅ Token obtenido:', token.slice(0, 20) + '...');

    // Intentamos acceder al perfil del usuario actual (requiere token válido)
    const response = await axios.get('https://api.spotify.com/v1/browse/new-releases', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('🎉 Conexión exitosa. Recibido:', response.data.albums.items.length, 'álbumes.');
  } catch (error) {
    console.error('❌ Error al probar el token:', error.response?.data || error.message);
  }
};

testToken();
