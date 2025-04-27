import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { promises as fs } from 'fs';

let mainWindow;
const __dirname = path.resolve();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'dashboard', 'dashboard.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Comunica con il frontend per mostrare lo stato
ipcMain.handle('load-changelog', async () => {
  try {
    const changelogPath = path.resolve('changelog.json');
    const data = await fs.readFile(changelogPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Errore caricando il changelog:', error.message);
    return [];
  }
});

