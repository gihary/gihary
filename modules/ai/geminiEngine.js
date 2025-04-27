import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyD_-GPvUYBGWXzngm8qb7fTwqNinL2bOao';
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function askGemini(prompt) {
  try {
    const response = await axios.post(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ]
    });

    const candidates = response.data.candidates;
    if (candidates && candidates.length > 0) {
      const text = candidates[0].content.parts[0].text;
      return text.trim();
    } else {
      console.error('❌ Nessuna risposta valida da Gemini.');
      return null;
    }
  } catch (error) {
    console.error('❌ Errore durante la richiesta a Gemini:', error.message);
    return null;
  }
}

