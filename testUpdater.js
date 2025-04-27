import { autoUpdateModule } from './modules/autoUpdater.js';

async function startUpdate() {
  await autoUpdateModule('modules/ai/engine.js');
}

startUpdate();

