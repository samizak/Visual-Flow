import React from "react";
import {
  FileIcon,
  Save,
  Upload,
  FileJson,
  Image as ImageIcon,
  Download,
  FileImage,
  FileSpreadsheet,
  FileText,
  File as FilePdf,
} from "lucide-react";
import { Button } from "../../ui/button";
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
} from "../../ui/dropdown-menu";
import PremiumFeatureWrapper from "../../PremiumFeatures/PremiumFeatureWrapper";

// Update the FileMenu props interface to include export handlers
interface FileMenuProps {
  onSave?: () => void;
  onImport?: () => void;
  onImportJson?: () => void;
  onImportImage?: () => void;
  onExportPng?: () => void;
  onExportJpg?: () => void;
  onExportSvg?: () => void;
  isPremiumUser?: boolean;
  onUpgradeClick?: () => void;
}

export default function FileMenu({
  onSave,
  onImport,
  onImportJson,
  onImportImage,
  onExportPng,
  onExportJpg,
  onExportSvg,
  isPremiumUser = false,
  onUpgradeClick,
}: FileMenuProps) {
  // Handle general import (fallback)
  const handleImportClick = () => {
    if (onImport) {
      onImport();
    }
  };

  // Handle JSON import
  const handleImportJsonClick = () => {
    if (onImportJson) {
      onImportJson();
    } else if (onImport) {
      // Fallback to general import if specific handler not provided
      onImport();
    }
  };

  // Handle Image import
  const handleImportImageClick = () => {
    if (isPremiumUser && onImportImage) {
      onImportImage();
    } else if (onUpgradeClick) {
      onUpgradeClick();
    }
  };

  // Export handlers
  const handleExportPngClick = () => {
    if (isPremiumUser && onExportPng) {
      onExportPng();
    } else if (onUpgradeClick) {
      onUpgradeClick();
    }
  };

  const handleExportJpgClick = () => {
    if (isPremiumUser && onExportJpg) {
      onExportJpg();
    } else if (onUpgradeClick) {
      onUpgradeClick();
    }
  };

  const handleExportSvgClick = () => {
    if (isPremiumUser && onExportSvg) {
      onExportSvg();
    } else if (onUpgradeClick) {
      onUpgradeClick();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer transition-colors select-none"
        >
          <FileIcon className="mr-1 h-4 w-4" />
          File
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#1e1e1e] border border-gray-700 shadow-lg z-50">
        <DropdownMenuLabel>File Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onSave}
          className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white"
        >
          <Save className="h-4 w-4" />
          <span>Save</span>
        </DropdownMenuItem>

        {/* Import submenu with JSON and Image options */}
        {onImportJson || onImportImage ? (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white">
              <Upload className="mr-2 h-4 w-4" />
              <span>Import</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-[#1e1e1e] border border-gray-700 shadow-lg">
              <DropdownMenuItem
                onClick={handleImportJsonClick}
                className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white"
              >
                <FileJson className="mr-2 h-4 w-4" />
                <span>JSON File</span>
              </DropdownMenuItem>

              {/* Wrap Image import with premium feature wrapper */}
              <DropdownMenuItem
                onClick={handleImportImageClick}
                className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white"
              >
                {isPremiumUser ? (
                  <>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    <span>Image (OCR)</span>
                  </>
                ) : (
                  <PremiumFeatureWrapper
                    isPremiumUser={isPremiumUser}
                    featureName="Image (OCR)"
                    onUpgradeClick={onUpgradeClick}
                  >
                    <div className="flex items-center">
                      <ImageIcon className="mr-2 h-4 w-4" />
                      <span>Image (OCR)</span>
                    </div>
                  </PremiumFeatureWrapper>
                )}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ) : null}

        {/* Export submenu with image format options */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white">
            <Download className="mr-2 h-4 w-4" />
            <span>Export</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-[#1e1e1e] border border-gray-700 shadow-lg">
            {/* JPG export - premium only */}
            <DropdownMenuItem
              onClick={handleExportJpgClick}
              className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white"
            >
              {isPremiumUser ? (
                <>
                  <FileImage className="mr-2 h-4 w-4" />
                  <span>JPG Image</span>
                </>
              ) : (
                <PremiumFeatureWrapper
                  isPremiumUser={isPremiumUser}
                  featureName="JPG Image"
                  onUpgradeClick={onUpgradeClick}
                >
                  <div className="flex items-center">
                    <FileImage className="mr-2 h-4 w-4" />
                    <span>JPG Image</span>
                  </div>
                </PremiumFeatureWrapper>
              )}
            </DropdownMenuItem>

            {/* SVG export - premium only */}
            <DropdownMenuItem
              onClick={handleExportSvgClick}
              className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white"
            >
              {isPremiumUser ? (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>SVG Vector</span>
                </>
              ) : (
                <PremiumFeatureWrapper
                  isPremiumUser={isPremiumUser}
                  featureName="SVG Vector"
                  onUpgradeClick={onUpgradeClick}
                >
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>SVG Vector</span>
                  </div>
                </PremiumFeatureWrapper>
              )}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
