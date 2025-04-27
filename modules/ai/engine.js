import axios from 'axios';

export async function askGihary(prompt) {
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: "phi3",
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.2,
        num_predict: 150
      }
    });

    const output = response.data.response.trim();
    return output;
  } catch (error) {
    console.error("Errore durante la comunicazione con Phi-3:", error.message);
    return null;
  }
}

