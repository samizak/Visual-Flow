export default function Footer({
  isValidJson,
  nodeCount,
}: {
  isValidJson: boolean;
  nodeCount: number;
}) {
  return (
    <div className="h-8 bg-[#1e1e1e] border-t border-gray-700 flex items-center justify-between px-4 text-sm">
      <div className="flex items-center">
        <span className="mr-2">JSON Status:</span>
        {isValidJson ? (
          <>
            <svg
              className="w-4 h-4 text-green-500 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-green-500">Valid</span>
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 text-red-500 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span className="text-red-500">Invalid</span>
          </>
        )}
      </div>

      {/* Add node count to the footer */}
      <div className="flex items-center">
        <span className="text-gray-400">Total Nodes: </span>
        <span className="text-white ml-1">{nodeCount}</span>
      </div>
    </div>
  );
}
