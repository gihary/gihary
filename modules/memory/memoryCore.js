import { promises as fs } from 'fs';
import path from 'path';

const memoryPath = path.resolve('memory.json');

// Funzione per caricare la memoria
export async function loadMemory() {
  try {
    const data = await fs.readFile(memoryPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Se il file non esiste, creiamo una memoria vuota
      await saveMemory([]);
      return [];
    }
    console.error('Errore nel caricamento della memoria:', error.message);
    return [];
  }
}

// Funzione per salvare la memoria
export async function saveMemory(memory) {
  try {
    await fs.writeFile(memoryPath, JSON.stringify(memory, null, 2));
  } catch (error) {
    console.error('Errore nel salvataggio della memoria:', error.message);
  }
}

// Funzione per aggiungere una nuova voce in memoria
export async function addMemoryEntry(entry) {
  const memory = await loadMemory();
  memory.push({
    timestamp: new Date().toISOString(),
    entry
  });
  await saveMemory(memory);
}

