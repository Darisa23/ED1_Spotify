import fs from 'fs';
import path from 'path';

// Ruta al archivo secuencial
const archivo = path.join('playlist_registros.txt');

// Leer el archivo y convertirlo en un array de líneas
const lineas = fs.readFileSync(archivo, 'utf-8').split('\n');

// Crear un objeto para contar cuántas veces aparece cada artista
const conteoArtistas = {};

for (const linea of lineas) {
  if (!linea.trim()) continue; // Evita procesar líneas vacías
  const partes = linea.split(',');
  const artistas = partes[3];
  const listaArtistas = artistas.split(', ');

  for (const artista of listaArtistas) {
    if (!conteoArtistas[artista]) conteoArtistas[artista] = 0;
    conteoArtistas[artista]++;
  }
}

// Encontrar el artista con más apariciones
let artistaTop = '';
let max = 0;

for (const [artista, cantidad] of Object.entries(conteoArtistas)) {
  if (cantidad > max) {
    max = cantidad;
    artistaTop = artista;
  }
}

console.log(`🎤 El artista con más canciones en la playlist es: ${artistaTop} (${max})`);

