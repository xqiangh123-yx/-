import { GoogleGenAI } from "@google/genai";
import { Metric, ProcessNode } from '../types';

// Initialize the client. The API key is injected via process.env
const getClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is missing. AI features will be simulated.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateSOPRecommendation = async (
  taskTitle: string, 
  metrics: Metric[]
): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return "AI Service Unavailable: Please configure API Key. (Mock: Check inventory levels and contact supplier immediately.)";
  }

  const metricContext = metrics.map(m => `${m.name}: ${m.value}${m.unit}`).join(', ');
  
  const prompt = `
    Context: You are an Operations Expert for an automotive Order-to-Delivery (OTD) system.
    Task: Create a concise Standard Operating Procedure (SOP) Checklist for the following operational issue.
    Issue: "${taskTitle}"
    Current Metrics: ${metricContext}
    
    Output Format:
    Return ONLY a list of 3-5 actionable bullet points. Keep it professional and direct.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No recommendation generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating SOP. Please check system logs.";
  }
};

export const analyzeBottleneck = async (node: ProcessNode): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return "AI Service Unavailable. (Mock: High metric deviation detected in scheduling latency.)";
  }

  const metricContext = node.metrics.map(m => `${m.name}: ${m.value}${m.unit}`).join(', ');

  const prompt = `
    Context: You are analyzing a bottleneck in a manufacturing process node: "${node.title}".
    Metrics: ${metricContext}
    
    Task: Provide a 2-sentence executive summary of why this node might be failing and 1 strategic recommendation.
  `;

  try {
     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Analysis complete.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error analyzing bottleneck.";
  }
};