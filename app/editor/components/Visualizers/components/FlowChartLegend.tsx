import React from "react";
import { Panel } from "@xyflow/react";
import { Box, Braces, Brackets, Type } from "lucide-react";
import { NodeTypeColors } from "../types/jsonFlowTypes";
import { getTypeColor } from "../utils/nodeUtils";

interface FlowChartLegendProps {
  nodeTypes: NodeTypeColors;
}

const FlowChartLegend: React.FC<FlowChartLegendProps> = ({ nodeTypes }) => {
  // Using the same colors as defined in nodeUtils.ts
  const rootColor = "#6b46c1"; // Purple for root node
  const objectColor = getTypeColor("object"); // "#3a506b" - Blue-gray
  const arrayColor = getTypeColor("array"); // "#b87333" - Orange
  const primitiveColor = getTypeColor("primitive"); // "#2e7d32" - Green

  return (
    <Panel position="top-left" className="legend-panel">
      <div className="bg-[#1e1e1e] border border-gray-700 rounded-md p-3 shadow-lg">
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center">
            <Box className="mr-2 text-white" size={16} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: rootColor }}></div>
            <span className="text-xs text-gray-300 ml-2">Root</span>
          </div>
          <div className="flex items-center">
            <Braces className="mr-2 text-white" size={16} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: objectColor }}></div>
            <span className="text-xs text-gray-300 ml-2">Objects</span>
          </div>
          <div className="flex items-center">
            <Brackets className="mr-2 text-white" size={16} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: arrayColor }}></div>
            <span className="text-xs text-gray-300 ml-2">Arrays</span>
          </div>
          <div className="flex items-center">
            <Type className="mr-2 text-white" size={16} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: primitiveColor }}></div>
            <span className="text-xs text-gray-300 ml-2">Primitives</span>
          </div>
        </div>
      </div>
    </Panel>
  );
};

export default FlowChartLegend;