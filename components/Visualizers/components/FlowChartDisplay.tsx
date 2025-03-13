import React, { useState } from "react";
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
} from "@xyflow/react";
import { Search } from "lucide-react";

interface FlowChartDisplayProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  nodeTypes: Record<string, React.ComponentType<any>>;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  controlsStyle: React.CSSProperties;
  proOptions: ProOptions;
}

const FlowChartDisplay: React.FC<FlowChartDisplayProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  nodeTypes,
  onNodeClick,
  controlsStyle,
  proOptions,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Highlight nodes that match the search term
    if (value.trim()) {
      highlightMatchingNodes(value);
    } else {
      // Reset highlighting when search is cleared
      resetHighlighting();
    }
  };

  // Highlight nodes that match the search term
  const highlightMatchingNodes = (term: string) => {
    const lowerTerm = term.toLowerCase();

    // Add a class to the flow container for styling
    const flowContainer = document.querySelector(".react-flow");
    flowContainer?.classList.add("dimmed");

    // Reset all previous highlighting first
    document.querySelectorAll(".search-match-property").forEach((element) => {
      element.classList.remove("search-match-property");
    });

    // Find and highlight matching nodes and their specific properties
    nodes.forEach((node: any) => {
      const nodeElement = document.querySelector(`[data-id="${node.id}"]`);
      
      // Check if node data contains the search term
      const nodeData = node.data;
      const nodeLabel = nodeData.label?.toLowerCase() || "";
      const nodeProperties = nodeData.properties || [];
      
      let hasMatch = false;
      
      // Check if the node label matches
      if (nodeLabel.includes(lowerTerm)) {
        hasMatch = true;
      }
      
      // Find all property elements in this node
      const propertyElements = nodeElement?.querySelectorAll(".grouped-node-property");
      
      // Check each property for matches
      nodeProperties.forEach((prop: any, index: number) => {
        const propKey = prop.key?.toLowerCase() || "";
        const propValue = String(prop.value).toLowerCase();
        
        if (propKey.includes(lowerTerm) || propValue.includes(lowerTerm)) {
          hasMatch = true;
          
          // If we found property elements, highlight the matching one
          if (propertyElements && propertyElements[index]) {
            propertyElements[index].classList.add("search-match-property");
          }
        }
      });
      
      // Add highlight class to the node if any match was found
      if (hasMatch) {
        nodeElement?.classList.add("highlight");
        nodeElement?.classList.add("search-match");
      } else {
        nodeElement?.classList.remove("highlight");
        nodeElement?.classList.remove("search-match");
      }
    });
  };

  // Reset all highlighting
  const resetHighlighting = () => {
    const flowContainer = document.querySelector(".react-flow");
    flowContainer?.classList.remove("dimmed");

    // Remove highlighting from all nodes
    nodes.forEach((node) => {
      const nodeElement = document.querySelector(`[data-id="${node.id}"]`);
      nodeElement?.classList.remove("highlight");
      nodeElement?.classList.remove("search-match");
    });
    
    // Remove highlighting from all property elements
    document.querySelectorAll(".search-match-property").forEach((element) => {
      element.classList.remove("search-match-property");
    });
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.1}
      maxZoom={2}
      proOptions={proOptions}
      connectionLineType={ConnectionLineType.SmoothStep}
    >
      <Controls style={controlsStyle} />
      <Background
        variant={BackgroundVariant.Dots}
        gap={12}
        size={1}
        color="#333"
      />

      {/* Search Panel - Moved to bottom left, next to Controls */}
      <Panel position="bottom-left" className="search-panel ml-[60px]">
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
              onClick={() => {
                setIsSearchOpen(false);
                setSearchTerm("");
                resetHighlighting();
              }}
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
    </ReactFlow>
  );
};

export default FlowChartDisplay;
