import { promises as fs } from 'fs';
import path from 'path';
import { askGihary } from './ai/engine.js';
import { backupFile } from './backup/backupManager.js';

const __dirname = path.resolve();

export async function autoUpdateModule(modulePath) {
  try {
    console.log(`🚀 Avvio aggiornamento automatico di: ${modulePath}`);

    const fullPath = path.resolve(__dirname, modulePath);

    // Step 1: Backup del file prima di modificarlo
    await backupFile(modulePath);

    // Step 2: Legge il contenuto attuale
    const oldCode = await fs.readFile(fullPath, 'utf-8');

    // Step 3: Chiede a Gihary di migliorare il codice
    const prompt = `Questo è il codice di un modulo JavaScript. Miglioralo mantenendo la funzionalità originale e correggendo eventuali errori:\n\n${oldCode}`;
    const newCode = await askGihary(prompt);

    if (!newCode) {
      console.error('❌ Nessuna nuova versione generata.');
      return;
    }

    // Step 4: Sovrascrive il file con il nuovo codice
    await fs.writeFile(fullPath, newCode);
    console.log(`✅ Modulo ${modulePath} aggiornato con successo!`);

    // Step 5: Verifica se il nuovo codice è valido
    try {
      new Function(newCode); // Tentiamo di interpretare il nuovo codice JS
    } catch (validationError) {
      console.error(`❌ Errore di sintassi rilevato in ${modulePath}, ripristino dal backup...`);
      // Ripristina il backup
      const backupsPath = path.resolve('backups');
      const backupFiles = await fs.readdir(backupsPath);
      const matchingBackup = backupFiles
        .filter(name => name.startsWith(path.basename(modulePath)))
        .sort()
        .reverse()[0]; // Ultimo backup disponibile

      if (matchingBackup) {
        const backupFullPath = path.join(backupsPath, matchingBackup);
        await fs.copyFile(backupFullPath, fullPath);
        console.log(`✅ Ripristinato ${modulePath} dal backup ${matchingBackup}`);
      } else {
        console.error('❌ Nessun backup trovato per il rollback.');
      }
    }

  } catch (error) {
    console.error('❌ Errore durante l\'auto-aggiornamento:', error.message);
  }
}

