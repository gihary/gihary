import { promises as fs } from 'fs';
import path from 'path';

// Funzione che ordina i file .js in base alla loro "priorità"
export async function prioritizeFiles(files) {
  const filesWithStats = await Promise.all(
    files.map(async (file) => {
      const stats = await fs.stat(file);
      return {
        path: file,
        size: stats.size,
        modifiedTime: stats.mtimeMs
      };
    })
  );

  // Ordina prima i file più piccoli (più veloci da migliorare), poi quelli più vecchi
  const sortedFiles = filesWithStats.sort((a, b) => {
    if (a.size !== b.size) {
      return a.size - b.size; // Prima i file più piccoli
    }
    return a.modifiedTime - b.modifiedTime; // Poi i file modificati meno recentemente
  });

  return sortedFiles.map(file => file.path);
}

