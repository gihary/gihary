export class TaskManager {
  constructor() {
    this.tasks = [];
  }

  // Aggiunge un nuovo task
  addTask(description) {
    const task = {
      id: this.tasks.length + 1,
      description,
      completed: false
    };
    this.tasks.push(task);
    console.log(`✅ Task aggiunto: ${description}`);
  }

  // Segna un task come completato
  completeTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = true;
      console.log(`🎯 Task completato: ${task.description}`);
    } else {
      console.log(`⚠️ Nessun task trovato con ID ${id}`);
    }
  }

  // Elenca tutti i task
  listTasks() {
    console.log("\n📋 Lista Task:");
    this.tasks.forEach(task => {
      console.log(`${task.id}. [${task.completed ? '✅' : '❌'}] ${task.description}`);
    });
  }

  // Ritorna i task incompleti
  getPendingTasks() {
    return this.tasks.filter(task => !task.completed);
  }

  // Ritorna tutti i task
  getAllTasks() {
    return this.tasks;
  }
}

