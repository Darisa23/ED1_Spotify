import fs from 'fs';
import path from 'path';

// Función que convierte JSON en .txt secuencial
export function crearArchivoSecuencial(jsonPath, outputPath) {
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  
  const lines = data.map(track =>
    `${track.id}|${track.name}|${track.artist.split('|').length}|${track.artist}|${track.artist_ids}|${track.popularity}|${track.duration_ms}|${track.image}`
);

  const text = lines.join('\n');

  fs.writeFileSync(outputPath, text);
}

// Función que encuentra el artista más repetido
export function artistaMasRepetido(txtPath) {
  const lineas = fs.readFileSync(txtPath, 'utf-8').split('\n');
  const conteoArtistas = {};
  const mapaNombreAId = {};

  for (const linea of lineas) {
    if (!linea.trim()) continue;
    const partes = linea.split('|');
    const cantidadArtistas = parseInt(partes[2]);
    const artistas = partes[3].split('|');
    const ids = partes[3+cantidadArtistas].split('|');

   for (let i = 0; i < artistas.length; i++) {
      const artista = artistas[i];
      const id = ids[i];
      if (!conteoArtistas[artista]) conteoArtistas[artista] = 0;
      conteoArtistas[artista]++;
      mapaNombreAId[artista] = id;
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

  return { artista: artistaTop, apariciones: max,  artista_id: mapaNombreAId[artistaTop],};
}
export function artistaConMasPopularidad(txtPath) {
  const lineas = fs.readFileSync(txtPath, 'utf-8').split('\n');
  const popularidadPorArtista = {};
  const conteo = {};
  const mapaNombreAId = {};

  for (const linea of lineas) {
    if (!linea.trim()) continue;
    const partes = linea.split('|');
    const artistas = partes[3].split('|');
    const ids = partes[4].split('|');
    const popularidad = parseInt(partes[5]);

    for (let i = 0; i < artistas.length; i++) {
      const artista = artistas[i];
      const id = ids[i];

      if (!popularidadPorArtista[artista]) {
        popularidadPorArtista[artista] = 0;
        conteo[artista] = 0;
        mapaNombreAId[artista] = id;
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

  return { artista: top, popularidadPromedio: maxProm.toFixed(2),id: mapaNombreAId[top] };
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
    const partes = linea.split('|');
    
    if (partes.length > 6 && !isNaN(parseInt(partes[6]))) {
      const duracion = parseInt(partes[6]);
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
    const partes = linea.split('|');
    
    if (partes.length > 6 && !isNaN(parseInt(partes[6]))) {
      const duracion = parseInt(partes[6]);
      if (duracion > promedio) {
        const minutos = Math.floor(duracion / 60000);
        const segundos = Math.floor((duracion % 60000) / 1000);
        const prom = `${minutos}m ${segundos}s`;
        canciones.push({
          nombre: partes[1],
          duracion_ms: prom,
          imagen_url: partes[7]
        });
      }
    }
  }

  return {
    promedio: prom,
    canciones_superan_promedio: canciones.map(cancion => ({
      nombre: cancion.nombre,
      duracion: cancion.duracion_ms,
      imagen: cancion.imagen_url
    }))
  };
}

export function cancionesOrdenadasPorPopularidad(txtPath) {
  const lineas = fs.readFileSync(txtPath, 'utf-8').split('\n');
  const canciones = [];

  for (const linea of lineas) {
    if (!linea.trim()) continue;
    const partes = linea.split('|');
    
    // Verificamos que exista un valor de popularidad y sea un número válido
    const popularidad = parseInt(partes[5]);
    if (!isNaN(popularidad)) {
      canciones.push({
        nombre: partes[1],
        popularidad: popularidad,
        artista: partes[3],
        imagen_url: partes[7]
      });
    }
  }

  // Ordenamos por popularidad descendente
  const cancionesOrdenadas = canciones.sort((a, b) => b.popularidad - a.popularidad);
  
  return {
    canciones_ordenadas: cancionesOrdenadas.map(cancion => ({
      nombre: cancion.nombre,
      popularidad: cancion.popularidad,
      imagen: cancion.imagen_url,
      artista: cancion.artista
    }))
  };
}
