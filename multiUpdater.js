import { promises as fs } from 'fs';
import path from 'path';
import { autoUpdateModule } from './modules/autoUpdater.js';
import { addChangelogEntry } from './modules/changelog/changelogManager.js';
import { prioritizeFiles } from './modules/priority/priorityManager.js';

const __dirname = path.resolve();

// Funzione per trovare tutti i file .js dentro modules/
async function findAllJsFiles(dirPath) {
  let files = [];
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const subFiles = await findAllJsFiles(fullPath);
      files = files.concat(subFiles);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Funzione principale che aggiorna tutti i file trovati
async function updateAllModules() {
  console.log('🚀 Inizio aggiornamento massivo dei moduli di Gihary...');

  const modulesPath = path.resolve('modules');
  let jsFiles = await findAllJsFiles(modulesPath);

  // 📌 Ora ordiniamo i file usando il Priority Manager!
  jsFiles = await prioritizeFiles(jsFiles);

  for (const file of jsFiles) {
    const relativePath = path.relative(__dirname, file);
    console.log(`🛠️ Aggiornamento modulo: ${relativePath}`);

    try {
      // Usa Gemini per migliorare i moduli
      await autoUpdateModule(relativePath, true);

      // Verifica che il file sia valido (controllo semplice)
      const content = await fs.readFile(file, 'utf-8');
      if (content.trim().endsWith('{') || content.trim().endsWith('[') || content.trim().endsWith(':')) {
        throw new Error('Codice troncato o incompleto rilevato.');
      }

      // Salva nel changelog
      await addChangelogEntry({
        modulo: relativePath,
        fonte: "Gemini",
        descrizione: "Miglioramento automatico del modulo con priorità."
      });

    } catch (error) {
      console.error(`❌ Errore durante l'aggiornamento di ${relativePath}:`, error.message);
      console.log('➡️ Procedo con il prossimo modulo...');
      continue;
    }
  }

  console.log('✅ Aggiornamento massivo terminato. Riavvio di Gihary...');
}

updateAllModules();

