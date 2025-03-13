import React from "react";
import { Loader2 } from "lucide-react";

interface OcrProcessingStatusProps {
  isProcessing: boolean;
  progress?: number;
}

export default function OcrProcessingStatus({ 
  isProcessing, 
  progress 
}: OcrProcessingStatusProps) {
  if (!isProcessing) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] border border-gray-700 rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Processing Image</h3>
          <p className="text-gray-400 text-center mb-4">
            Extracting JSON data from your image using OCR. This may take a moment...
          </p>
          
          {progress !== undefined && (
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
              <div 
                className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${Math.max(5, progress)}%` }}
              ></div>
            </div>
          )}
          
          <p className="text-xs text-gray-500">
            Processing locally in your browser. Your data stays private.
          </p>
        </div>
      </div>
    </div>
  );
}