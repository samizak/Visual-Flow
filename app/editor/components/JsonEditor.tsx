import React, { useEffect } from "react";
import Editor from "@monaco-editor/react";
import { storageService } from "@/utils/storageService";
import { useAutoSave } from "@/hooks/useAutoSave";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  options?: any;
  autoSave?: boolean;
}

export default function JsonEditor({
  value,
  onChange,
  options = {},
  autoSave = true,
}: JsonEditorProps) {
  const jsonContent = value;
  const setJsonContent = onChange;

  useEffect(() => {
    if (autoSave) {
      const savedData = storageService.getJsonData();
      if (savedData && savedData.content) {
        setJsonContent(savedData.content);
      }
    }
  }, [setJsonContent, autoSave]);

  useAutoSave(jsonContent, autoSave);

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
        ...options,
      }}
    />
  );
}
