// You'll need to install these packages:
// npm install html-to-image file-saver
// npm install @types/file-saver --save-dev

import { toPng, toJpeg, toSvg } from "html-to-image";
import { saveAs } from "file-saver";
import { successToast, errorToast } from "../lib/toast";

/**
 * Prepares the visualization for export by temporarily hiding UI elements
 * @returns A cleanup function to restore the original state
 */
// In the prepareVisualizationForExport function, add this code to ensure edges are visible
const prepareVisualizationForExport = () => {
  // Elements to hide during export
  const elementsToHide = [
    ".react-flow__controls",
    ".react-flow__panel",
    ".search-container",
    ".legend-container",
    ".controls-container",
    ".zoom-controls",
    ".minimap-container",
  ];

  // Store original display values to restore later
  const originalStyles: { element: HTMLElement; display: string }[] = [];
  
  // Store original edge styles
  const originalEdgeStyles: { element: SVGElement; style: string }[] = [];
  
  // Hide elements
  elementsToHide.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      if (el instanceof HTMLElement) {
        originalStyles.push({ element: el, display: el.style.display });
        el.style.display = "none";
      }
    });
  });
  
  // Enhance edge visibility for export
  const edgePaths = document.querySelectorAll('.react-flow__edge-path');
  edgePaths.forEach((path) => {
    if (path instanceof SVGElement) {
      originalEdgeStyles.push({ element: path, style: path.getAttribute('style') || '' });
      path.setAttribute('stroke-width', '2');
      path.setAttribute('stroke', '#555');
      path.setAttribute('stroke-opacity', '1');
    }
  });
  
  // Make sure edges are visible and have pointer-events
  const edges = document.querySelectorAll('.react-flow__edge');
  edges.forEach((edge) => {
    if (edge instanceof HTMLElement) {
      edge.style.pointerEvents = 'auto';
      edge.style.opacity = '1';
    }
  });

  // Return cleanup function
  return () => {
    // Restore original display values
    originalStyles.forEach(({ element, display }) => {
      element.style.display = display;
    });
    
    // Restore original edge styles
    originalEdgeStyles.forEach(({ element, style }) => {
      element.setAttribute('style', style);
    });
    
    // Restore edge pointer-events
    edges.forEach((edge) => {
      if (edge instanceof HTMLElement) {
        edge.style.pointerEvents = 'none';
      }
    });
  };
};

/**
 * Checks if there's valid JSON data to export
 * @returns boolean indicating if export should proceed
 */
const validateExportData = () => {
  // Check if visualization exists
  const element = document.querySelector(".react-flow");
  if (!element) {
    errorToast("No visualization found. Please add valid JSON data first.");
    return false;
  }

  // Check if there are nodes in the visualization
  const nodes = document.querySelectorAll(".react-flow__node");
  if (nodes.length === 0) {
    errorToast("No data to export. Please add valid JSON data first.");
    return false;
  }

  return true;
};

/**
 * Fits the graph to view before export
 * @returns Promise that resolves when the graph is fitted
 */
// Update the fitGraphToView function to add a longer delay
const fitGraphToView = async () => {
  // Get the ReactFlow instance
  const reactFlowInstance = (window as any).reactFlowInstance;

  if (reactFlowInstance && typeof reactFlowInstance.fitView === "function") {
    // Add padding to ensure all elements are visible
    reactFlowInstance.fitView({ padding: 0.2 });

    // Wait a moment for the fit animation to complete and edges to render
    return new Promise((resolve) => setTimeout(resolve, 500)); // Increased from 300 to 500
  }

  return Promise.resolve();
};

/**
 * Exports the visualization as a PNG image
 * @param selector CSS selector for the element to export
 * @param filename Optional custom filename
 */
// Add this function to handle CORS issues with stylesheets
const handleCORSIssues = () => {
  // Find all link elements with stylesheets
  const styleLinks = document.querySelectorAll('link[rel="stylesheet"]');

  // Store original href values
  const originalHrefs: { element: HTMLLinkElement; href: string }[] = [];

  // Process each stylesheet
  styleLinks.forEach((link) => {
    if (link instanceof HTMLLinkElement) {
      // Check if it's an external stylesheet (likely to cause CORS issues)
      if (link.href && !link.href.startsWith(window.location.origin)) {
        originalHrefs.push({ element: link, href: link.href });

        // Temporarily disable the stylesheet
        link.disabled = true;
      }
    }
  });

  // Return cleanup function
  return () => {
    // Restore original stylesheet states
    originalHrefs.forEach(({ element, href }) => {
      element.disabled = false;
    });
  };
};

// Then in your export functions, use this instead of skipStylesheets
export const exportAsPng = async (
  selector: string = ".react-flow",
  filename: string = "json-visualization"
) => {
  try {
    // Validate data before proceeding
    if (!validateExportData()) return;

    // Prepare for export by hiding UI elements
    const cleanupUI = prepareVisualizationForExport();

    // Handle CORS issues with stylesheets
    const cleanupCORS = handleCORSIssues();

    // Fit graph to view
    await fitGraphToView();

    const element = document.querySelector(selector);
    if (!element) {
      throw new Error("Visualization element not found");
    }

    // Show loading toast
    successToast("Generating PNG image...", {
      autoClose: false,
      hideProgressBar: false,
    });

    // Capture the element as PNG with improved quality
    // In the exportAsPng function, update the options
    const dataUrl = await toPng(element as HTMLElement, {
      backgroundColor: "#121212",
      quality: 1.0,
      pixelRatio: 3,
      width: element.scrollWidth,
      height: element.scrollHeight,
      style: {
        transform: "scale(1)",
        transformOrigin: "top left",
      },
      filter: (node) => {
        // Make sure we include SVG elements for edges
        if (node.tagName === 'path' && node.classList && 
            node.classList.contains('react-flow__edge-path')) {
          return true;
        }
        
        // Filter out problematic elements that might cause CORS issues
        const exclusionClasses = ["monaco-editor"];
        return !exclusionClasses.some(
          (className) => node.classList && node.classList.contains(className)
        );
      },
      skipFonts: true,
    });

    // Similarly, remove skipStylesheets from exportAsJpeg and exportAsSvg functions

    // Save the image
    saveAs(dataUrl, `${filename}.png`);

    // Update toast
    successToast("PNG image exported successfully!");

    // Restore original state
    cleanupUI();
    cleanupCORS();
  } catch (error) {
    console.error("Error exporting as PNG:", error);
    errorToast(
      `Failed to export as PNG: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

// Apply the same pattern to exportAsJpeg and exportAsSvg
/**
 * Exports the visualization as a JPEG image
 * @param selector CSS selector for the element to export
 * @param filename Optional custom filename
 * @param quality JPEG quality (0-1)
 */
export const exportAsJpeg = async (
  selector: string = ".react-flow",
  filename: string = "json-visualization",
  quality: number = 0.95 // Increased from 0.9 to 0.95
) => {
  try {
    // Validate data before proceeding
    if (!validateExportData()) return;

    // Prepare for export by hiding UI elements
    const cleanupUI = prepareVisualizationForExport();
    
    // Handle CORS issues with stylesheets
    const cleanupCORS = handleCORSIssues();

    // Fit graph to view
    await fitGraphToView();

    const element = document.querySelector(selector);
    if (!element) {
      throw new Error("Visualization element not found");
    }

    // Show loading toast
    successToast("Generating JPEG image...", {
      autoClose: false,
      hideProgressBar: false,
    });

    // Capture the element as JPEG with improved quality
    const dataUrl = await toJpeg(element as HTMLElement, {
      backgroundColor: "#121212",
      quality: quality,
      pixelRatio: 3, // Increased from 2 to 3 for better quality
      width: element.scrollWidth,
      height: element.scrollHeight,
      style: {
        // Ensure the entire graph is captured
        transform: "scale(1)",
        transformOrigin: "top left",
      },
      filter: (node) => {
        // Filter out problematic elements that might cause CORS issues
        const exclusionClasses = ["monaco-editor"];
        return !exclusionClasses.some(
          (className) => node.classList && node.classList.contains(className)
        );
      },
      skipFonts: true,
    });

    // Save the image
    saveAs(dataUrl, `${filename}.jpg`);

    // Update toast
    successToast("JPEG image exported successfully!");

    // Restore original state
    cleanupUI();
    cleanupCORS();
  } catch (error) {
    console.error("Error exporting as JPEG:", error);
    errorToast(
      `Failed to export as JPEG: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

/**
 * Exports the visualization as an SVG image
 * @param selector CSS selector for the element to export
 * @param filename Optional custom filename
 */
export const exportAsSvg = async (
  selector: string = ".react-flow",
  filename: string = "json-visualization"
) => {
  try {
    // Validate data before proceeding
    if (!validateExportData()) return;

    // Prepare for export by hiding UI elements
    const cleanupUI = prepareVisualizationForExport();
    
    // Handle CORS issues with stylesheets
    const cleanupCORS = handleCORSIssues();

    // Fit graph to view
    await fitGraphToView();

    const element = document.querySelector(selector);
    if (!element) {
      throw new Error("Visualization element not found");
    }

    // Show loading toast
    successToast("Generating SVG image...", {
      autoClose: false,
      hideProgressBar: false,
    });

    // Capture the element as SVG
    const dataUrl = await toSvg(element as HTMLElement, {
      backgroundColor: "#121212",
      width: element.scrollWidth,
      height: element.scrollHeight,
      style: {
        // Ensure the entire graph is captured
        transform: "scale(1)",
        transformOrigin: "top left",
      },
      filter: (node) => {
        // Filter out problematic elements that might cause CORS issues
        const exclusionClasses = ["monaco-editor"];
        return !exclusionClasses.some(
          (className) => node.classList && node.classList.contains(className)
        );
      },
      skipFonts: true,
    });

    // Save the image
    saveAs(dataUrl, `${filename}.svg`);

    // Update toast
    successToast("SVG image exported successfully!");

    // Restore original state
    cleanupUI();
    cleanupCORS();
  } catch (error) {
    console.error("Error exporting as SVG:", error);
    errorToast(
      `Failed to export as SVG: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
