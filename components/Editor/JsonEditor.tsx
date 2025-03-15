import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { storageService } from "../../utils/storageService";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  options?: any;
}

export default function JsonEditor({ value, onChange, options = {} }: JsonEditorProps) {
  // Use the passed value as the content
  const jsonContent = value;
  const setJsonContent = onChange;

  // Load saved JSON data when component mounts
  useEffect(() => {
    const savedData = storageService.getJsonData();
    if (savedData && savedData.content) {
      // Set the editor content with saved data
      setJsonContent(savedData.content);
    }
  }, [setJsonContent]);

  // Add auto-save functionality
  useEffect(() => {
    // Save JSON data whenever content changes
    // Add debounce to avoid excessive saves
    const debounceTimer = setTimeout(() => {
      if (jsonContent) {
        storageService.saveJsonData(jsonContent);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(debounceTimer);
  }, [jsonContent]);

  return (
    <Editor
      height="100%"
      defaultLanguage="json"
      value={jsonContent}
      onChange={(value) => setJsonContent(value || "")}
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        fontSize: 14,
        lineNumbers: "on",
        renderIndentGuides: true,
        tabSize: 2,
        ...options
      }}
    />
  );
}
