import { promises as fs } from 'fs';
import path from 'path';

const changelogPath = path.resolve('changelog.json');

// Crea il file changelog se non esiste
async function ensureChangelogFile() {
  try {
    await fs.access(changelogPath);
  } catch (error) {
    await fs.writeFile(changelogPath, JSON.stringify([], null, 2));
  }
}

// Aggiunge una nuova voce al changelog
export async function addChangelogEntry(entry) {
  try {
    await ensureChangelogFile();

    const data = await fs.readFile(changelogPath, 'utf-8');
    const changelog = JSON.parse(data);

    changelog.push({
      timestamp: new Date().toISOString(),
      ...entry
    });

    await fs.writeFile(changelogPath, JSON.stringify(changelog, null, 2));
    console.log('📝 Nuova voce aggiunta al changelog!');
  } catch (error) {
    console.error('❌ Errore durante la scrittura del changelog:', error.message);
  }
}

