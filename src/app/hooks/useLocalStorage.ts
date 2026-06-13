// Hook for managing localStorage with type safety and persistence
import { useState, useEffect } from 'react';

/**
 * Custom hook for localStorage operations with automatic serialization/deserialization
 * and SSR safety. Persists and retrieves data with optional default value.
 * 
 * @param key - localStorage key
 * @param initialValue - default value if localStorage is empty or during SSR
 * @returns [value, setValue] - current value and setter function
 * 
 * Usage:
 * const [language, setLanguage] = useLocalStorage<'en' | 'es'>('lang', 'en');
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // State to store value | pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Check if running on client side
      if (typeof window === 'undefined') {
        return initialValue;
      }

      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      
      // Parse stored json or return initialValue if not found
      if (item) {
        return JSON.parse(item);
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = (value: T) => {
    try {
      // Allow value to be a function for same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
