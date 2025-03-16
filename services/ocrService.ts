import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

const PROMPT = `
You are a highly precise Optical Character Recognition (OCR) engine specialized in extracting text from images, even from complex layouts and slightly imperfect images. Your goal is to provide the most accurate reconstruction of the JSON structure within the image, represented as a compact, valid JSON string.
Your task is to analyze the uploaded image, extract \_all\_ textual content, and \*\*reconstruct the JSON structure as a single, valid JSON string\*\*. If there are any issues with mismatched or missing brackets in the extracted text that prevent it from being valid JSON, automatically correct them to create valid JSON.
The result must be returned in the following JSON format:
\`\`\`json
{"extracted_json":"[INSERT_RECONSTRUCTED_JSON_HERE]"}
\`\`\`
\*\*Important Considerations:\*\*
\* The returned JSON string within "extracted\_json" must be a complete and valid JSON object or array.
\* If there is an error during the extraction or JSON parsing process, *after attempting to automatically fix bracket issues*, add a new key called "error" to the returned JSON, with the error message as its value. For example:
\`\`\`json
{"extracted_json": "", "error": "Invalid JSON format detected after bracket correction."}
\`\`\`
\* If no text is found in the image, return:
\`\`\`json
{"extracted_json": "", "error": "no text found"}
\`\`\`
\* Ensure the returned JSON is fully formed and does not have any trailing commas or unclosed brackets.
\* Prioritize fixing bracket mismatches (e.g., missing closing brackets, extra opening brackets) to create valid JSON.
`;

// Convert File to base64 string
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function extractTextFromImage(imageFile: File): Promise<string> {
  try {
    const base64Image = await fileToBase64(imageFile);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.2,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
    });

    const result = await model.generateContent([
      PROMPT,
      { inlineData: { mimeType: imageFile.type, data: base64Image } },
    ]);

    return result.response.text();
  } catch (error) {
    // This is a fatal error - log it as it's likely a bug or API issue
    console.error("Gemini API error:", error);
    throw new Error("Failed to extract text from image using Gemini");
  }
}

export async function parseJsonFromText(text: string): Promise<any> {
  try {
    const cleaned_text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    const jsonObject = JSON.parse(cleaned_text);

    if (!jsonObject.hasOwnProperty("extracted_json")) {
      throw new Error(
        "Invalid response format: missing 'extracted_json' property"
      );
    }

    // Check if there's an error reported from the OCR service
    if (jsonObject.hasOwnProperty("error")) {
      if (jsonObject.error === "no text found") {
        throw new Error(
          "OCR service error: Unable to detect any text in the provided image. Please ensure the image contains clear, readable text."
        );
      } else {
        throw new Error(`OCR service error: ${jsonObject.error}`);
      }
    }

    const fixedInnerJsonString = jsonObject.extracted_json.replace(
      /,\s*([\]}])/g,
      "$1"
    );

    try {
      const parsedJson = JSON.parse(fixedInnerJsonString);
      return JSON.stringify(parsedJson, null, 2);
    } catch (innerError) {
      // This is an expected error - don't log to console
      throw new Error(
        `Invalid JSON in extracted content: ${(innerError as Error).message}`
      );
    }
  } catch (error) {
    // Only log unexpected errors that aren't part of the known error types
    const errorMessage = (error as Error).message;

    // Don't log expected errors
    if (
      !errorMessage.includes("OCR service error") &&
      !errorMessage.includes("Invalid response format") &&
      !errorMessage.includes("Invalid JSON in extracted content")
    ) {
      console.error("Unexpected JSON parsing error:", error);
    }

    // Return the error message instead of an empty object
    throw error;
  }
}
