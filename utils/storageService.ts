// Improved storage service with better typing and more concise methods
interface JsonData {
  content: string;
  lastModified: number;
}

interface AppSettings {
  edgeStyle?: string;
  showGrid?: boolean;
  autoSaveEnabled?: boolean;
}

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  edgeStyle: 'default',
  showGrid: true,
  autoSaveEnabled: true
};

class StorageService {
  private readonly JSON_DATA_KEY = 'json_visualizer_data';
  private readonly SETTINGS_KEY = 'json_visualizer_settings';

  // Generic method to get data from localStorage with type safety
  private getItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error retrieving ${key} from localStorage:`, error);
      return defaultValue;
    }
  }

  // Generic method to save data to localStorage
  private setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }

  // JSON data methods
  getJsonData(): JsonData {
    return this.getItem<JsonData>(this.JSON_DATA_KEY, { content: '', lastModified: Date.now() });
  }

  saveJsonData(content: string): void {
    this.setItem<JsonData>(this.JSON_DATA_KEY, {
      content,
      lastModified: Date.now()
    });
  }

  // Settings methods
  getSettings(): AppSettings {
    return { ...DEFAULT_SETTINGS, ...this.getItem<AppSettings>(this.SETTINGS_KEY, {}) };
  }

  saveSettings(settings: Partial<AppSettings>): void {
    const currentSettings = this.getSettings();
    this.setItem<AppSettings>(this.SETTINGS_KEY, { ...currentSettings, ...settings });
  }

  // Clear all data
  clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.JSON_DATA_KEY);
    localStorage.removeItem(this.SETTINGS_KEY);
  }
}

export const storageService = new StorageService();