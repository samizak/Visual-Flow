/**
 * Storage service for persisting JSON data
 */
const STORAGE_KEY = 'json_visualiser_data';
const SETTINGS_KEY = 'json_visualiser_settings';

export interface StoredJsonData {
  content: string;
  timestamp: number;
  name?: string;
}

export interface AppSettings {
  autoSaveEnabled: boolean;
  edgeStyle: string;
  showGrid: boolean;
}

export const storageService = {
  /**
   * Save JSON data to localStorage
   */
  saveJsonData(jsonContent: string, name?: string): void {
    try {
      const data: StoredJsonData = {
        content: jsonContent,
        timestamp: Date.now(),
        name
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving JSON data to localStorage:', error);
    }
  },

  /**
   * Retrieve JSON data from localStorage
   */
  getJsonData(): StoredJsonData | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error retrieving JSON data from localStorage:', error);
      return null;
    }
  },

  /**
   * Clear stored JSON data
   */
  clearJsonData(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Save application settings
   */
  saveSettings(settings: Partial<AppSettings>): void {
    try {
      // Get existing settings first
      const existingSettings = this.getSettings();
      const updatedSettings = { ...existingSettings, ...settings };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  },

  /**
   * Get application settings
   */
  getSettings(): AppSettings {
    try {
      const settings = localStorage.getItem(SETTINGS_KEY);
      return settings 
        ? JSON.parse(settings) 
        : { autoSaveEnabled: true, edgeStyle: 'default', showGrid: true };
    } catch (error) {
      console.error('Error retrieving settings from localStorage:', error);
      return { autoSaveEnabled: true, edgeStyle: 'default', showGrid: true };
    }
  }
};