import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

// Helper to convert File to Base64 and ensure it is a JPEG
// This fixes issues with unsupported formats like AVIF or HEIC by drawing to a canvas
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // We keep the original dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
             reject(new Error('Could not get canvas context'));
             return;
        }
        
        // Draw image to canvas
        ctx.drawImage(img, 0, 0);
        
        // Convert to JPEG, quality 0.85 is a good balance
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        
        // Remove the data URL prefix "data:image/jpeg;base64,"
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      };
      
      img.onerror = () => reject(new Error("Failed to load image for conversion"));
      
      // Handle the src for the image
      if (e.target?.result) {
        img.src = e.target.result as string;
      } else {
        reject(new Error("FileReader result is empty"));
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const analyzePlantImage = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    // API Key must be obtained from environment variables
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Updated to latest model for multimodal tasks
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType, // This should usually be 'image/jpeg' now
            },
          },
          {
            text: SYSTEM_PROMPT
          }
        ]
      },
      config: {
        temperature: 0.4, // Lower temperature for more deterministic/factual diagnoses
        topK: 32,
        topP: 0.95,
      }
    });

    if (response.text) {
      return response.text;
    } else {
      throw new Error("A IA não retornou uma resposta textual. Tente novamente com uma foto mais clara.");
    }

  } catch (error: any) {
    console.error("Error analyzing plant:", error);
    // Improve error message for UI
    if (error.message && error.message.includes("400")) {
        throw new Error("Erro na imagem enviada. Tente tirar uma nova foto em formato JPG ou PNG.");
    }
    throw error;
  }
};