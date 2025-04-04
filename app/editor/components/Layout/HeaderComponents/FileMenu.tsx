import React from "react";
import {
  FileIcon,
  Save,
  Upload,
  FileJson,
  Image as ImageIcon,
  Download,
  FileImage,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useJsonStore } from "@/store/useJsonStore";
import { useFileOperations } from "@/hooks/useFileOperations";
import { handleImageImport } from "@/utils/importHandlers";
import { exportAsPng, exportAsJpeg, exportAsSvg } from "@/utils/exportHandlers";
import { errorToast, infoToast } from "@/lib/toast";
import { useSupabase } from "@/components/Auth/SupabaseProvider";

interface FileMenuProps {
  onUpgradeClick?: (featureName: string) => void;
}

export default function FileMenu({ onUpgradeClick }: FileMenuProps) {
  // Get state and actions from Zustand store
  const {
    jsonData,
    setJsonData,
    setIsLoading,
    setOcrProcessing,
    setOcrProgress,
    setVisualizationJson,
  } = useJsonStore();

  const { user, isPro } = useSupabase();

  const isPremiumUser = isPro;

  const handleSaveJson = () => {
    try {
      if (jsonData && jsonData.trim()) {
        const blob = new Blob([jsonData], { type: "application/json" });

        // Create a download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "data.json";

        infoToast("Starting download...", { duration: 2000 });

        a.addEventListener("click", () => {
          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 100);
        });

        document.body.appendChild(a);
        a.click();
      } else {
        errorToast("Cannot save empty JSON");
      }
    } catch (e) {
      errorToast("Failed to save JSON");
    }
  };

  // Use hooks for operations
  const { importFile } = useFileOperations({
    setJsonData,
    onSuccessfulLoad: (content) => {
      setVisualizationJson(content);
    },
  });

  // Handle Image import
  const handleImportImageClick = () => {
    if (isPremiumUser) {
      handleImageImport(
        setJsonData,
        setOcrProcessing,
        setOcrProgress,
        isPremiumUser
      );
    } else if (onUpgradeClick) {
      onUpgradeClick("Image Import (OCR)");
    }
  };

  // Export handlers - pass jsonData to ensure they have access to current data
  const handleExportPngClick = () => {
    if (isPremiumUser) {
      if (jsonData && jsonData.trim()) {
        exportAsPng();
      } else {
        errorToast("No JSON data to export");
      }
    } else if (onUpgradeClick) {
      onUpgradeClick("PNG Export");
    }
  };

  const handleExportJpgClick = () => {
    if (isPremiumUser) {
      if (jsonData && jsonData.trim()) {
        exportAsJpeg();
      } else {
        errorToast("No JSON data to export");
      }
    } else if (onUpgradeClick) {
      onUpgradeClick("JPG Export");
    }
  };

  const handleExportSvgClick = () => {
    if (isPremiumUser) {
      if (jsonData && jsonData.trim()) {
        exportAsSvg();
      } else {
        errorToast("No JSON data to export");
      }
    } else if (onUpgradeClick) {
      onUpgradeClick("SVG Export");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer transition-colors select-none focus:ring-0 focus:outline-none"
        >
          <FileIcon className="mr-1 h-4 w-4" />
          File
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#1e1e1e] border border-gray-700 shadow-lg z-50">
        <DropdownMenuLabel>File Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSaveJson}
          className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white focus:ring-0 focus:outline-none"
        >
          <Save className="h-4 w-4" />
          <span>Save</span>
        </DropdownMenuItem>

        {/* Import submenu with JSON and Image options */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white focus:ring-0 focus:outline-none">
            <Upload className="mr-2 h-4 w-4" />
            <span>Import</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-[#1e1e1e] border border-gray-700 shadow-lg">
            <DropdownMenuItem
              onClick={importFile}
              className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white focus:ring-0 focus:outline-none"
            >
              <FileJson className="mr-2 h-4 w-4" />
              <span>JSON File</span>
            </DropdownMenuItem>

            {/* Image import - premium feature */}
            <DropdownMenuItem
              onClick={handleImportImageClick}
              className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white focus:ring-0 focus:outline-none"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              <span>Image (OCR)</span>
              {!isPremiumUser && (
                <span className="ml-auto text-xs text-yellow-400">PRO</span>
              )}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Export submenu with image format options */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white focus:ring-0 focus:outline-none">
            <Download className="mr-2 h-4 w-4" />
            <span>Export</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-[#1e1e1e] border border-gray-700 shadow-lg">
            {/* PNG export - premium feature */}
            <DropdownMenuItem
              onClick={handleExportPngClick}
              className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white focus:ring-0 focus:outline-none"
            >
              <FileImage className="mr-2 h-4 w-4" />
              <span>PNG Image</span>
              {!isPremiumUser && (
                <span className="ml-auto text-xs text-yellow-400">PRO</span>
              )}
            </DropdownMenuItem>

            {/* JPG export - premium feature */}
            <DropdownMenuItem
              onClick={handleExportJpgClick}
              className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white focus:ring-0 focus:outline-none"
            >
              <FileImage className="mr-2 h-4 w-4" />
              <span>JPG Image</span>
              {!isPremiumUser && (
                <span className="ml-auto text-xs text-yellow-400">PRO</span>
              )}
            </DropdownMenuItem>

            {/* SVG export - premium feature */}
            <DropdownMenuItem
              onClick={handleExportSvgClick}
              className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white focus:ring-0 focus:outline-none"
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>SVG Vector</span>
              {!isPremiumUser && (
                <span className="ml-auto text-xs text-yellow-400">PRO</span>
              )}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
