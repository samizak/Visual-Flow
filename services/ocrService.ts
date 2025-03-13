import { createWorker } from "tesseract.js";

export async function extractTextFromImage(imageFile: File): Promise<string> {
  try {
    const worker = await createWorker("eng");

    // Convert file to image data
    const imageData = await fileToImageData(imageFile);

    // Recognize text
    const { data } = await worker.recognize(imageData);

    // Terminate worker
    await worker.terminate();

    return data.text;
  } catch (error) {
    console.error("OCR processing error:", error);
    throw new Error("Failed to extract text from image");
  }
}

// Helper function to convert File to image data
async function fileToImageData(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Try to parse extracted text as JSON
export async function parseJsonFromText(text: string): Promise<any> {
  try {
    // Clean up the text - remove common OCR errors and formatting issues
    const cleanedText = text
      .replace(/[\u2018\u2019]/g, "'") // Replace smart quotes
      .replace(/[\u201C\u201D]/g, '"') // Replace smart double quotes
      .replace(/\n/g, " ") // Replace newlines with spaces
      .trim();

    // Modified regex to work without 's' flag by using [\s\S] instead of dot
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("No valid JSON structure found in the text");
    }
  } catch (error) {
    console.error("JSON parsing error:", error);
    throw new Error("Failed to parse JSON from extracted text");
  }
}
