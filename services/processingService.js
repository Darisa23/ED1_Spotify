import fs from 'fs';
import path from 'path';

// Función que convierte JSON en .txt secuencial
export function crearArchivoSecuencial(jsonPath, outputPath) {
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  const lines = data.map(track =>
    `${track.id},${track.name},${track.artist.split(', ').length},${track.artist},${track.popularity},${track.duration_ms}`
  );

  const text = lines.join('\n');

  fs.writeFileSync(outputPath, text);
}

// Función que encuentra el artista más repetido
export function artistaMasRepetido(txtPath) {
  const lineas = fs.readFileSync(txtPath, 'utf-8').split('\n');
  const conteoArtistas = {};

  for (const linea of lineas) {
    if (!linea.trim()) continue;
    const partes = linea.split(',');
    const artistas = partes[3];
    const listaArtistas = artistas.split(', ');

    for (const artista of listaArtistas) {
      if (!conteoArtistas[artista]) conteoArtistas[artista] = 0;
      conteoArtistas[artista]++;
    }
  }

  let artistaTop = '';
  let max = 0;

  for (const [artista, cantidad] of Object.entries(conteoArtistas)) {
    if (cantidad > max) {
      max = cantidad;
      artistaTop = artista;
    }
  }

  return { artista: artistaTop, apariciones: max };
}
export function artistaConMasPopularidad(txtPath) {
  const lineas = fs.readFileSync(txtPath, 'utf-8').split('\n');
  const popularidadPorArtista = {};
  const conteo = {};

  for (const linea of lineas) {
    if (!linea.trim()) continue;
    const partes = linea.split(',');
    const artistas = partes[3].split(', ');
    const popularidad = parseInt(partes[4]);

    for (const artista of artistas) {
      if (!popularidadPorArtista[artista]) {
        popularidadPorArtista[artista] = 0;
        conteo[artista] = 0;
      }
      popularidadPorArtista[artista] += popularidad;
      conteo[artista]++;
    }
  }

  let top = '';
  let maxProm = 0;

  for (const artista in popularidadPorArtista) {
    const prom = popularidadPorArtista[artista] / conteo[artista];
    if (prom > maxProm) {
      maxProm = prom;
      top = artista;
    }
  }

  return { artista: top, popularidadPromedio: maxProm.toFixed(2) };
}
export function tamañoPromedioBytesPorRegistro(txtPath) {
  const lineas = fs.readFileSync(txtPath, 'utf-8').split('\n');
  const totalBytes = lineas.reduce((sum, l) => sum + Buffer.byteLength(l, 'utf-8'), 0);
  const promedio = totalBytes / lineas.length;
  return promedio.toFixed(2); // En bytes, con 2 decimales
}


export function cancionesSuperanPromedio(txtPath) {
  const lineas = fs.readFileSync(txtPath, 'utf-8').split('\n');
  const canciones = [];

  let suma = 0;
  let count = 0;

  // Primer recorrido: calcular el promedio de duraciones
  for (const linea of lineas) {
    if (!linea.trim()) continue;
    const partes = linea.split(',');
    
    if (partes.length > 5 && !isNaN(parseInt(partes[5]))) {
      const duracion = parseInt(partes[5]);
      suma += duracion;
      count++;
    }
  }

  const promedio = count > 0 ? suma / count : 0;
  //redondeamos el promedio para trabajar sin decimales:
  const promedioRedondeado = Math.round(promedio);
  //pasamos el promedio a minutos
  const minutos = Math.floor(promedioRedondeado / 60000);
  const segundos = Math.floor((promedioRedondeado % 60000) / 1000);
  const prom = `${minutos}m ${segundos}s`;
  // Segundo recorrido: filtrar canciones que superan el promedio
  for (const linea of lineas) {
    if (!linea.trim()) continue;
    const partes = linea.split(',');
    
    if (partes.length > 5 && !isNaN(parseInt(partes[5]))) {
      const duracion = parseInt(partes[5]);
      if (duracion > promedio) {
        const minutos = Math.floor(duracion / 60000);
        const segundos = Math.floor((duracion % 60000) / 1000);
        const prom = `${minutos}m ${segundos}s`;
        canciones.push({
          nombre: partes[1],
          duracion_ms: prom
        });
      }
    }
  }

  return [`Promedio de duración: ${prom} `, 
          `Canciones que superan el promedio (${prom}):`].concat(
    canciones.map(cancion => `${cancion.nombre}: ${cancion.duracion_ms}`)
  );
}

export function cancionesOrdenadasPorPopularidad(txtPath) {
  const lineas = fs.readFileSync(txtPath, 'utf-8').split('\n');
  const canciones = [];

  for (const linea of lineas) {
    if (!linea.trim()) continue;
    const partes = linea.split(',');
    
    // Verificamos que exista un valor de popularidad y sea un número válido
    const popularidad = parseInt(partes[4]);
    if (!isNaN(popularidad)) {
      canciones.push({
        nombre: partes[1],
        popularidad: popularidad,
        artista: partes[3]
      });
    }
  }

  // Ordenamos por popularidad descendente
  const cancionesOrdenadas = canciones.sort((a, b) => b.popularidad - a.popularidad);
  
  // Formateamos el resultado como strings
  return cancionesOrdenadas.map(cancion => `${cancion.nombre}: ${cancion.popularidad} - ${cancion.artista}`);
}
