// Hook for managing language selection with localStorage persistence
import { useContext } from 'react';
import { LangContext } from '../components/LangContext';

/**
 * Hook to access language context and translations
 * Provides typed translations from the shared LangContext
 * 
 * Usage:
 * const { lang, setLang, t } = useLang();
 */
export function useLang() {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error('useLang must be used within LangProvider');
  }
  return context;
}
