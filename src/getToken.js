require('dotenv').config();//para usar las variables de entorno
//librería de JavaScript para hacer peticiones HTTP, como GET, POST, PUT, DELETE, etc.
const axios = require('axios');
//creamos la función para obtener el token
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

// Exportar para usar en otros archivos
module.exports = getToken;
