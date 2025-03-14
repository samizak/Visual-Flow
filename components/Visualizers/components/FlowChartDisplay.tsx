import React, { useState, useCallback } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  ProOptions,
  Panel,
  NodeTypes,
} from "@xyflow/react";
import { Search } from "lucide-react";
import FlowChartLegend from "./FlowChartLegend";
import { NodeTypeColors } from "../types/jsonFlowTypes";

interface FlowChartDisplayProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  nodeTypes: NodeTypes;
  onNodeClick?: (event: React.MouseEvent, node: Node) => void;
  controlsStyle?: React.CSSProperties;
  proOptions?: ProOptions;
  showGrid?: boolean;
}

const nodeTypeColors: NodeTypeColors = {
  string: "#9333ea",
  number: "#eab308",
  boolean: "#ef4444",
  object: "#3b82f6",
  array: "#22c55e",
  null: "#6b7280",
};

const FlowChartDisplay: React.FC<FlowChartDisplayProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  nodeTypes,
  onNodeClick,
  controlsStyle,
  proOptions,
  showGrid = true,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Reset all highlighting
  const resetHighlighting = useCallback(() => {
    const flowContainer = document.querySelector(".react-flow");
    flowContainer?.classList.remove("dimmed");

    // Remove highlighting from all nodes
    nodes.forEach((node) => {
      const nodeElement = document.querySelector(`[data-id="${node.id}"]`);
      nodeElement?.classList.remove("highlight", "search-match");
    });

    // Remove highlighting from all property elements
    document.querySelectorAll(".search-match-property").forEach((element) => {
      element.classList.remove("search-match-property");
    });
  }, [nodes]);

  // Highlight nodes that match the search term
  const highlightMatchingNodes = useCallback((term: string) => {
    const lowerTerm = term.toLowerCase();

    // Add a class to the flow container for styling
    document.querySelector(".react-flow")?.classList.add("dimmed");

    // Reset all previous highlighting first
    document.querySelectorAll(".search-match-property").forEach((element) => {
      element.classList.remove("search-match-property");
    });

    // Find and highlight matching nodes and their specific properties
    nodes.forEach((node: any) => {
      const nodeElement = document.querySelector(`[data-id="${node.id}"]`);
      const nodeData = node.data;
      const nodeLabel = nodeData.label?.toLowerCase() || "";
      const nodeProperties = nodeData.properties || [];

      let hasMatch = nodeLabel.includes(lowerTerm);

      // Find all property elements in this node
      const propertyElements = nodeElement?.querySelectorAll(".grouped-node-property");

      // Check each property for matches
      nodeProperties.forEach((prop: any, index: number) => {
        const propKey = prop.key?.toLowerCase() || "";
        const propValue = String(prop.value).toLowerCase();

        if (propKey.includes(lowerTerm) || propValue.includes(lowerTerm)) {
          hasMatch = true;

          // If we found property elements, highlight the matching one
          propertyElements?.[index]?.classList.add("search-match-property");
        }
      });

      // Add highlight class to the node if any match was found
      if (hasMatch) {
        nodeElement?.classList.add("highlight", "search-match");
      } else {
        nodeElement?.classList.remove("highlight", "search-match");
      }
    });
  }, [nodes]);

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    value.trim() ? highlightMatchingNodes(value) : resetHighlighting();
  }, [highlightMatchingNodes, resetHighlighting]);

  // Handle search close
  const handleSearchClose = useCallback(() => {
    setIsSearchOpen(false);
    setSearchTerm("");
    resetHighlighting();
  }, [resetHighlighting]);

  // Search panel component
  const SearchPanel = (
    <Panel position="top-right" className="search-panel">
      {isSearchOpen ? (
        <div className="flex items-center bg-[#1e1e1e] border border-gray-700 rounded-md overflow-hidden shadow-lg">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search nodes..."
            className="bg-transparent text-white px-3 py-2 outline-none w-64"
            autoFocus
          />
          <button
            onClick={handleSearchClose}
            className="px-3 py-2 text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center justify-center bg-[#1e1e1e] border border-gray-700 p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
          title="Search nodes"
        >
          <Search size={18} />
        </button>
      )}
    </Panel>
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      connectionLineType={ConnectionLineType.SmoothStep}
      fitView
      proOptions={proOptions}
    >
      {showGrid && (
        <Background
          variant={BackgroundVariant.Lines}
          gap={100}
          size={0.5}
          color="rgba(255, 255, 255, 0.05)"
        />
      )}
      <Controls style={controlsStyle} />
      {SearchPanel}
      <FlowChartLegend nodeTypes={nodeTypeColors} />
    </ReactFlow>
  );
};

export default FlowChartDisplay;
