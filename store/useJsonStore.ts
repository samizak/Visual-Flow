import { create } from 'zustand';
import { storageService } from '../utils/storageService';

interface JsonState {
  // JSON data
  jsonData: string;
  visualizationJson: string;
  isValidJson: boolean;
  
  // UI state
  nodeCount: number;
  collapseLeftPanel: boolean;
  edgeType: string;
  showGrid: boolean;
  isSettingsOpen: boolean;
  
  // Processing states
  isOcrProcessing: boolean;
  ocrProgress: number | undefined;
  isLoading: boolean;
  
  // Actions
  setJsonData: (data: string) => void;
  setVisualizationJson: (data: string) => void;
  setIsValidJson: (isValid: boolean) => void;
  setNodeCount: (count: number) => void;
  toggleLeftPanel: () => void;
  setEdgeType: (type: string) => void;
  setShowGrid: (show: boolean) => void;
  setIsSettingsOpen: (isOpen: boolean) => void;
  setOcrProcessing: (isProcessing: boolean) => void;
  setOcrProgress: (progress: number | undefined) => void;
  setIsLoading: (isLoading: boolean) => void;
  applyChangesToVisualization: () => void;
  isPremiumUser: boolean;
}

export const useJsonStore = create<JsonState>((set, get) => ({
  // Initial state
  jsonData: '',
  visualizationJson: '',
  isValidJson: true,
  nodeCount: 0,
  collapseLeftPanel: false,
  edgeType: 'default',
  showGrid: true,
  isSettingsOpen: false,
  isOcrProcessing: false,
  ocrProgress: undefined,
  isLoading: false,
  isPremiumUser: false,
  
  // Actions
  setJsonData: (data) => set({ jsonData: data }),
  setVisualizationJson: (data) => set({ visualizationJson: data }),
  setIsValidJson: (isValid) => set({ isValidJson: isValid }),
  setNodeCount: (count) => set({ nodeCount: count }),
  toggleLeftPanel: () => set((state) => ({ collapseLeftPanel: !state.collapseLeftPanel })),
  setEdgeType: (type) => {
    set({ edgeType: type });
    storageService.saveSettings({ edgeStyle: type });
  },
  setShowGrid: (show) => {
    set({ showGrid: show });
    storageService.saveSettings({ showGrid: show });
  },
  setIsSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
  setOcrProcessing: (isProcessing) => set({ isOcrProcessing: isProcessing }),
  setOcrProgress: (progress) => set({ ocrProgress: progress }),
  setIsLoading: (isLoading) => set({ isLoading: isLoading }),
  
  // Complex actions
  applyChangesToVisualization: () => {
    const { jsonData, isValidJson } = get();
    if (isValidJson && jsonData.trim()) {
      set({ visualizationJson: jsonData });
    }
  },
  
  // If you need to add a setter for this property:
  setIsPremiumUser: (isPremium: boolean) => set({ isPremiumUser: isPremium }),
}));