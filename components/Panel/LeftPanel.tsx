import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

export default function LeftPanel({
  jsonInput,
  setJsonInput,
}: {
  jsonInput: any;
  setJsonInput: any;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const validateAndParseJson = (input: string) => {
    if (!input.trim()) {
      throw new Error("Please enter some JSON data");
    }
    if (input.length > 10000000) {
      // 10MB limit
      throw new Error("JSON is too large to process");
    }
    return JSON.parse(input);
  };
  const formatJsonWithSyntax = (text: string) => {
    if (!text) return text;
    try {
      const lines = text.split("\n");
      return lines
        .map((line) => {
          return line
            .replace(/"([^"]+)":/g, '<span class="text-[#9cdcfe]">"$1"</span>:')
            .replace(
              /: ?"([^"]+)"/g,
              ': <span class="text-[#ce9178]">"$1"</span>'
            )
            .replace(/: ?(\d+)/g, ': <span class="text-[#b5cea8]">$1</span>')
            .replace(
              /: ?(true|false|null)/g,
              ': <span class="text-[#569cd6]">$1</span>'
            );
        })
        .join("\n");
    } catch {
      return text;
    }
  };

  const handleFormatJson = () => {
    setIsProcessing(true);
    try {
      const parsed = validateAndParseJson(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid JSON: Please check your syntax."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMinifyJson = () => {
    setIsProcessing(true);
    try {
      const parsed = validateAndParseJson(jsonInput);
      setJsonInput(JSON.stringify(parsed));
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid JSON: Please check your syntax."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonInput);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset copy status after 2 seconds
    } catch (err) {
      console.error("Failed to copy JSON:", err);
      setError("Failed to copy to clipboard");
    }
  };

  return (
    <div className="w-1/2 flex flex-col gap-4">
      <Card className="flex-grow p-4 bg-[#1e1e1e] border-[#333333] shadow-md">
        <h2 className="text-lg font-semibold mb-2 text-[#d4d4d4]">
          JSON Editor
        </h2>
        <div className="relative flex min-h-[500px] border border-[#3e3e42] rounded-md overflow-hidden">
          {/* Line Numbers */}
          <div className="py-2 px-2 bg-[#252526] text-[#858585] text-right select-none font-mono text-sm w-12 border-r border-[#3e3e42]">
            {jsonInput.split("\n").map((_: any, i: number) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
            {!jsonInput && <div className="leading-6">1</div>}
          </div>

          {/* Editor Area with Indent Guides */}
          <div className="relative flex-1">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #333333 1px, transparent 1px)",
                backgroundSize: "2ch",
                backgroundPosition: "calc(2ch + 2px) 0",
                opacity: 0.2,
              }}
            />
            <div
              className="min-h-[500px] w-full font-mono p-2 leading-6 bg-transparent relative"
              dangerouslySetInnerHTML={{
                __html:
                  formatJsonWithSyntax(jsonInput) ||
                  `<span class="text-[#6a9955]">// Paste your JSON here</span>`,
              }}
            />
            <Textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setError(null);
              }}
              className="absolute inset-0 font-mono resize-none border-0 rounded-none bg-transparent text-[#d4d4d4] focus-visible:ring-0 focus-visible:ring-offset-0 p-2 leading-6 caret-white"
              placeholder={`{
  "key": "value"
}`}
              spellCheck={false}
            />
          </div>
        </div>
        {error && <p className="text-[#f14c4c] mt-2 text-sm">{error}</p>}
        <div className="flex gap-2 mt-4">
          <Button
            onClick={handleFormatJson}
            disabled={isProcessing}
            className="bg-[#0e639c] hover:bg-[#1177bb] text-white border-0"
          >
            {isProcessing ? "Processing..." : "Format JSON"}
          </Button>
          <Button
            onClick={handleMinifyJson}
            disabled={isProcessing}
            className="bg-[#0e639c] hover:bg-[#1177bb] text-white border-0"
          >
            {isProcessing ? "Processing..." : "Minify JSON"}
          </Button>
          <Button
            onClick={handleCopyJson}
            disabled={!jsonInput}
            className="bg-[#0e639c] hover:bg-[#1177bb] text-white border-0"
          >
            {isCopied ? "Copied!" : "Copy JSON"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
