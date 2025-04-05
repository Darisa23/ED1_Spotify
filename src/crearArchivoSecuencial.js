import fs from 'fs'; // Módulo para archivos

// Leo el JSON generado
const data = JSON.parse(fs.readFileSync('playlist_data.json', 'utf-8'));

// Armo cada línea con los datos
const lines = data.map(track =>
  `${track.id},${track.name},${track.artist.split(', ').length},${track.artist},${track.popularity},${track.duration_ms}`
);

// Uno todo en un solo texto
const text = lines.join('\n');

// Escribo el archivo .txt
fs.writeFileSync('playlist_registros.txt', text);
