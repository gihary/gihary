import { askGihary } from './ai/engine.js';
import { TaskManager } from './tasks/taskManager.js';
import { addMemoryEntry } from './memory/memoryCore.js';

const taskManager = new TaskManager();

// Funzione principale del Reactor
export async function reactorCycle(objective) {
  console.log(`🚀 Avvio del ciclo di reazione per obiettivo: "${objective}"`);

  // Step 1: Chiedi a Gihary come raggiungere l'obiettivo
  const plan = await askGihary(`Scomponi questo obiettivo in 3 task chiari e pratici: "${objective}"`);
  
  // Step 2: Aggiungi ogni task suggerito
  const tasks = plan.split('\n').filter(line => line.trim() !== '');
  
  tasks.forEach((task, index) => {
    taskManager.addTask(task.trim());
  });

  // Step 3: Simuliamo l'esecuzione dei task
  for (const task of taskManager.getPendingTasks()) {
    console.log(`🛠️  Eseguendo task: ${task.description}`);
    
    // (Qui potresti far eseguire davvero i task... per ora li completiamo simulando)
    taskManager.completeTask(task.id);

    // Salva ogni task completato nella memoria
    await addMemoryEntry({ task: task.description, status: 'completato' });
  }

  console.log('✅ Ciclo di reazione completato!');
}

