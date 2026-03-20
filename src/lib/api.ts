import { THRAppData } from './store';

// Ganti dengan API Key lo. Corsproxy menjamin gak ada error CORS pas deploy Vercel/Netlify.
const API_KEY = "YOUR_OPENAI_API_KEY"; 
const API_URL = "https://corsproxy.io/?https://api.openai.com/v1/chat/completions";

export const generateQuote = async (data: THRAppData): Promise<string> => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: `Berikan 1 kalimat inspiratif Lebaran. Total THR diterima Rp ${data.stats.totalDiterima} dari ${data.thrMasuk.length} pemberi. Tanpa emoji, tanpa kata pembuka, max 2 kalimat.` }],
        temperature: 0.7, max_tokens: 100
      })
    });
    if (!res.ok) throw new Error("API Error");
    const json = await res.json();
    return json.choices[0].message.content.trim();
  } catch (e) {
    return `Dari ${data.thrMasuk.length} pemberi, terkumpul Rp ${data.stats.totalDiterima}. Semoga membawa berkah untuk kita semua.`;
  }
};

export const chatWithAI = async (message: string, data: THRAppData, history: {role: string, content: string}[]): Promise<string> => {
  try {
    const systemPrompt = `Anda AI THR Assistant. Total THR: Rp ${data.stats.totalDiterima}, Pemberi: ${data.thrMasuk.length}. Jawab profesional, pakai data user. DILARANG pakai emoji. Max 150 kata.`;
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: systemPrompt }, ...history, { role: "user", content: message }],
        temperature: 0.7, max_tokens: 200
      })
    });
    if (!res.ok) throw new Error("API Error");
    const json = await res.json();
    return json.choices[0].message.content;
  } catch (e) {
    return "Sistem sedang memproses data yang padat. Silakan coba beberapa saat lagi.";
  }
}; 
