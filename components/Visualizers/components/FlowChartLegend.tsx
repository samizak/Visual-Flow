import React from "react";
import { Panel } from "reactflow";
import { FlowChartLegendProps } from "../types/jsonFlowTypes";

const FlowChartLegend: React.FC<FlowChartLegendProps> = ({ nodeTypes }) => {
  return (
    <Panel position="top-right">
      <div className="bg-[#1e1e1e] p-2 rounded text-white text-xs">
        <div className="flex items-center mb-1">
          <div
            className="w-3 h-3 mr-2 rounded-full"
            style={{ backgroundColor: nodeTypes.string }}
          ></div>
          <span>String</span>
        </div>
        <div className="flex items-center mb-1">
          <div
            className="w-3 h-3 mr-2 rounded-full"
            style={{ backgroundColor: nodeTypes.number }}
          ></div>
          <span>Number</span>
        </div>
        <div className="flex items-center mb-1">
          <div
            className="w-3 h-3 mr-2 rounded-full"
            style={{ backgroundColor: nodeTypes.boolean }}
          ></div>
          <span>Boolean</span>
        </div>
        <div className="flex items-center mb-1">
          <div
            className="w-3 h-3 mr-2 rounded-full"
            style={{ backgroundColor: nodeTypes.object }}
          ></div>
          <span>Object</span>
        </div>
        <div className="flex items-center mb-1">
          <div
            className="w-3 h-3 mr-2 rounded-full"
            style={{ backgroundColor: nodeTypes.array }}
          ></div>
          <span>Array</span>
        </div>
        <div className="flex items-center">
          <div
            className="w-3 h-3 mr-2 rounded-full"
            style={{ backgroundColor: nodeTypes.null }}
          ></div>
          <span>Null</span>
        </div>
      </div>
    </Panel>
  );
};

export default FlowChartLegend;