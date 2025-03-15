import { useEffect } from 'react';
import { storageService } from '../utils/storageService';

export function useAutoSave(content: string, isEnabled: boolean = true, debounceTime: number = 1000) {
  useEffect(() => {
    if (!isEnabled || !content) return;
    
    const debounceTimer = setTimeout(() => {
      storageService.saveJsonData(content);
    }, debounceTime);
    
    return () => clearTimeout(debounceTimer);
  }, [content, isEnabled, debounceTime]);
}