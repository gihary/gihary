import { promises as fs } from 'fs';
import path from 'path';

const backupDir = path.resolve('backups');

// Crea la cartella backup se non esiste
async function ensureBackupDir() {
  try {
    await fs.mkdir(backupDir, { recursive: true });
  } catch (error) {
    console.error('Errore nella creazione della cartella backup:', error.message);
  }
}

// Salva una copia di sicurezza del file
export async function backupFile(filePath) {
  try {
    await ensureBackupDir();
    const fileName = path.basename(filePath);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `${fileName}.${timestamp}.bak`;

    const originalFullPath = path.resolve(filePath);
    const backupFullPath = path.join(backupDir, backupFileName);

    await fs.copyFile(originalFullPath, backupFullPath);
    console.log(`🛡 Backup creato: ${backupFileName}`);
  } catch (error) {
    console.error('Errore durante il backup del file:', error.message);
  }
}

