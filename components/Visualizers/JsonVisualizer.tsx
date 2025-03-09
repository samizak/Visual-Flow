// In your JsonVisualizer component
import { useEffect, useRef } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Background,
  Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css"; // Import the styles
import { useMemo } from "react";
import GroupedNode from "./components/GroupedNode";

interface JsonVisualizerProps {
  jsonData: string;
  testName?: string;
}

// Define node types
const nodeTypes = {
  grouped: GroupedNode,
};

function JsonVisualizer({
  jsonData,
  testName,
  skipUpdate = false,
}: JsonVisualizerProps & { skipUpdate?: boolean }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const renderCompleteRef = useRef(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Initialize worker
    workerRef.current = new Worker(
      new URL("../../workers/jsonProcessor.worker.ts", import.meta.url)
    );

    // Set up worker message handler
    workerRef.current.onmessage = (event) => {
      const { success, data, error, testName: eventTestName } = event.data;

      if (success) {
        setNodes(data.nodes);
        setEdges(data.edges);

        // Use requestAnimationFrame to ensure we measure after rendering
        requestAnimationFrame(() => {
          console.log(
            "Dispatching render complete event for test:",
            eventTestName
          );

          // Dispatch custom event to signal rendering is complete
          const event = new CustomEvent("diagramRenderComplete", {
            detail: { testName: eventTestName },
          });
          window.dispatchEvent(event);

          // Set flag to prevent multiple events
          renderCompleteRef.current = true;

          // Also set loading to false in parent component
          setTimeout(() => {
            console.log("Dispatching loading complete event");
            const loadingCompleteEvent = new CustomEvent("testLoadingComplete");
            window.dispatchEvent(loadingCompleteEvent);
          }, 100);
        });
      } else {
        console.error("Error processing JSON:", error);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    if (!jsonData || !workerRef.current || skipUpdate) return;

    try {
      // Reset render complete flag
      renderCompleteRef.current = false;

      // Send data to worker for processing
      workerRef.current.postMessage({ jsonData, testName });
    } catch (error) {
      console.error("Error sending data to worker:", error);
    }
  }, [jsonData, testName, skipUpdate]);

  // Memoize the ReactFlow component to prevent unnecessary re-renders
  const flowComponent = useMemo(() => (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.1}
      maxZoom={1.5}
      defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
      proOptions={{ hideAttribution: true }}
    >
      <Background />
      <Controls />
    </ReactFlow>
  ), [nodes, edges, onNodesChange, onEdgesChange]);
  
  // Return the memoized component
  return (
    <div style={{ width: "100%", height: "500px" }}>
      {flowComponent}
    </div>
  );
}

export default function JsonVisualizerWithProvider(props: JsonVisualizerProps) {
  return (
    <ReactFlowProvider>
      <JsonVisualizer {...props} />
    </ReactFlowProvider>
  );
}
