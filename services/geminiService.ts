import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types";

const STORAGE_KEY = 'smartspend_gemini_api_key';

// Helper functions for API key management
export const getUserApiKey = (): string | null => {
  return localStorage.getItem(STORAGE_KEY);
};

export const setUserApiKey = (apiKey: string): void => {
  localStorage.setItem(STORAGE_KEY, apiKey.trim());
};

export const clearUserApiKey = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const isApiKeyAvailable = (): boolean => {
  const key = getUserApiKey();
  return key !== null && key.trim().length > 0;
};

// Lazy initialization of AI client
const getAIClient = (): GoogleGenAI | null => {
  const apiKey = getUserApiKey();
  if (!apiKey) return null;

  try {
    return new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error("Error initializing Gemini AI:", error);
    return null;
  }
};

export const getFinancialAdvice = async (transactions: Transaction[]): Promise<string> => {
  const ai = getAIClient();

  if (!ai) {
    return "🔑 **AI Features Locked**\n\nTo unlock AI-powered financial insights, please add your Gemini API key in Settings.\n\n✨ Get your **free** API key at [ai.google.dev](https://ai.google.dev/) (1,500 requests/day free!)\n\n**What you'll get:**\n- Personalized spending analysis\n- Smart savings recommendations\n- Investment insights\n- Financial health score";
  }

  if (transactions.length === 0) {
    return "Please add some transactions to generate insights.";
  }

  const summary = transactions.map(t =>
    `${t.date}: ${t.type.toUpperCase()} - ${t.description} (${t.category}) : ₹${t.amount}`
  ).join('\n');

  const prompt = `
    You are a smart financial advisor for an Indian user. Analyze the following transaction history (in INR ₹) and provide a concise summary.
    
    1. Identify spending habits.
    2. Suggest areas for savings relevant to the Indian market if applicable.
    3. Comment on the investment ratio (PF, SIPs, etc).
    
    Format the response in simple Markdown with bullet points. 
    Keep the tone encouraging, modern, and professional.

    Transaction History:
    ${summary}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Unable to generate advice at this time.";
  } catch (error) {
    console.error("Error fetching AI advice:", error);
    return "❌ **Error:** Unable to connect to Gemini API. Please check your API key in Settings and try again.";
  }
};

export const parseTransactionFromNaturalLanguage = async (
  input: string,
  availableCategories: string[],
  todayDate: string
): Promise<{ amount: number; description: string; category: string; type: 'expense' | 'income' | 'investment'; date: string } | null> => {

  const ai = getAIClient();
  if (!ai) {
    return null; // Silently fail - UI should handle this
  }

  const prompt = `
    Analyze this text: "${input}".
    Today is ${todayDate}.
    
    Extract transaction details.
    1. Map 'category' to one of these strictly: ${availableCategories.join(', ')}. If no match, pick the closest semantically or use the first one.
    2. 'type' must be 'expense', 'income', or 'investment'.
    3. 'amount' must be a number.
    4. 'date' should be YYYY-MM-DD. Handle 'yesterday', 'today', etc. relative to today.
    5. 'description' should be short and capitalized.

    Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['expense', 'income', 'investment'] },
            date: { type: Type.STRING }
          },
          required: ['amount', 'description', 'category', 'type', 'date']
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing natural language:", error);
    return null;
  }
};

export const analyzeReceipt = async (
  imageBase64: string,
  availableCategories: string[],
  todayDate: string
): Promise<{ amount: number; description: string; category: string; date: string } | null> => {

  const ai = getAIClient();
  if (!ai) {
    return null; // Silently fail - UI should handle this
  }

  const prompt = `
      Analyze this receipt image.
      Today is ${todayDate}.
      
      Extract:
      1. Total Amount (number only).
      2. Merchant Name or Description (short string).
      3. Date (YYYY-MM-DD). If date is missing, use today's date.
      4. Category (Pick one closest to: ${availableCategories.join(', ')}).
      
      Return JSON.
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            date: { type: Type.STRING }
          },
          required: ['amount', 'description', 'category', 'date']
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Error scanning receipt:", error);
    return null;
  }
}

export const chatWithFinance = async (
  transactions: Transaction[],
  userMessage: string
): Promise<string> => {
  const ai = getAIClient();

  if (!ai) {
    return "🔑 Please add your Gemini API key in Settings to use AI chat features.";
  }

  if (transactions.length === 0) return "I don't have any transaction data to answer that yet.";

  const summary = transactions.map(t =>
    `${t.date}: ${t.type} - ${t.description} (${t.category}) : ₹${t.amount}`
  ).join('\n');

  const prompt = `
      You are a helpful financial assistant. 
      Here is the user's transaction data (JSON-like format):
      ${summary}

      User Question: "${userMessage}"

      Answer the user's question based strictly on the data provided. 
      Be concise, friendly, and use formatting like bolding for amounts (e.g. **₹500**).
      If the user asks about something not in the data, say you don't know.
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    return response.text || "I couldn't understand that.";
  } catch (error) {
    console.error("Error in chat:", error);
    return "❌ Error connecting to Gemini API. Please check your API key in Settings.";
  }
}