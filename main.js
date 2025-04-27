import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { askGihary } from './modules/ai/engine.js';
import { addMemoryEntry } from './modules/memory/memoryCore.js';

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');

  // Quando il frontend manda un messaggio "user-prompt", rispondiamo
  ipcMain.handle('user-prompt', async (event, prompt) => {
    const response = await askGihary(prompt);

    if (response) {
      // Salva la conversazione nella memoria
      await addMemoryEntry({ prompt, response });
    }

    return response;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

