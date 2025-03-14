import {
  extractTextFromImage,
  parseJsonFromText,
} from "../services/ocrService";
import { successToast, errorToast, infoToast } from "../lib/toast"; // Add infoToast import

// Handler for importing JSON files
export const handleJsonImport = (
  setJsonContent: (content: string) => void,
  setIsLoading?: (loading: boolean) => void
) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (setIsLoading) setIsLoading(true);

    try {
      const text = await file.text();
      // Validate JSON
      JSON.parse(text); // This will throw if invalid

      // Update editor state with the JSON content
      setJsonContent(text);

      successToast("Your JSON file has been successfully imported.");
    } catch (error) {
      errorToast("The selected file doesn't contain valid JSON.");
    } finally {
      if (setIsLoading) setIsLoading(false);
    }
  };

  input.click();
};

// Handler for importing images and extracting JSON via OCR
export const handleImageImport = (
  setJsonContent: (content: string) => void,
  setIsLoading: (loading: boolean) => void,
  setOcrProgress?: (progress: number | undefined) => void
) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    setIsLoading(true);
    if (setOcrProgress) setOcrProgress(0);

    // Declare progressInterval here so it's in scope for the finally block
    let progressInterval: NodeJS.Timeout | undefined;

    try {
      // Use our new infoToast function
      infoToast("Extracting text from image...");

      // Simulate progress updates
      if (setOcrProgress) {
        let progress = 0;
        progressInterval = setInterval(() => {
          progress += 5;
          if (progress > 90) progress = 90;
          setOcrProgress(progress);
        }, 500);
      }

      // Extract text from image
      const extractedText = await extractTextFromImage(file);

      // Update progress
      if (setOcrProgress) setOcrProgress(95);

      try {
        // Try to parse JSON from the extracted text
        const jsonData = await parseJsonFromText(extractedText);
        setJsonContent(jsonData);

        if (setOcrProgress) setOcrProgress(100);

        successToast("JSON successfully extracted from image.");
      } catch (parseError) {
        // Handle specific parsing errors with more informative messages
        const errorMessage = (parseError as Error).message;
        let userFriendlyMessage = "Could not extract valid JSON from the image.";
        
        if (errorMessage.includes("missing 'extracted_json'")) {
          userFriendlyMessage = "The OCR service couldn't identify a JSON structure in the image.";
        } else if (errorMessage.includes("OCR service error")) {
          userFriendlyMessage = errorMessage.replace("OCR service error: ", "");
        } else if (errorMessage.includes("Invalid JSON in extracted content")) {
          userFriendlyMessage = "Found text in the image, but it's not valid JSON.";
        } else {
          // Only log unexpected errors
          console.error("Unexpected OCR error:", parseError);
        }
        
        errorToast(userFriendlyMessage);
      }
    } catch (error) {
      // This is likely a fatal error with the API or network - log it
      console.error("Fatal image processing error:", error);
      errorToast("Could not process the image. Please try again.");
    } finally {
      setIsLoading(false);
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      if (setOcrProgress) {
        setTimeout(() => setOcrProgress(undefined), 500);
      }
    }
  };

  input.click();
};
