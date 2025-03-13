import { extractTextFromImage, parseJsonFromText } from '../services/ocrService';
import { toast } from 'sonner'; // Change to use sonner instead of use-toast

// Handler for importing JSON files
export const handleJsonImport = (
  setJsonContent: (content: string) => void,
  setIsLoading?: (loading: boolean) => void
) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
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
      
      toast.success("JSON Imported", {
        description: "Your JSON file has been successfully imported.",
      });
    } catch (error) {
      toast.error("Import Failed", {
        description: "The selected file doesn't contain valid JSON.",
      });
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
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    if (setOcrProgress) setOcrProgress(0);
    
    // Declare progressInterval here so it's in scope for the finally block
    let progressInterval: NodeJS.Timeout | undefined;
    
    try {
      toast.info("Processing Image", {
        description: "Extracting text from image...",
      });
      
      // Simulate progress updates (since Tesseract doesn't provide easy progress)
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
      
      // Try to parse JSON from the extracted text
      const jsonData = await parseJsonFromText(extractedText);
      
      // Format the JSON and update editor
      const formattedJson = JSON.stringify(jsonData, null, 2);
      setJsonContent(formattedJson);
      
      if (setOcrProgress) setOcrProgress(100);
      
      toast.success("Image Processed", {
        description: "JSON successfully extracted from image.",
      });
    } catch (error) {
      toast.error("Processing Failed", {
        description: "Could not extract valid JSON from the image.",
      });
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