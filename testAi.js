import { askGihary } from './modules/ai/engine.js';

async function testGihary() {
  const risposta = await askGihary("Suggeriscimi tre modi per migliorare un assistente personale.");
  console.log("\nRisposta di Gihary: ", risposta);
}

testGihary();

