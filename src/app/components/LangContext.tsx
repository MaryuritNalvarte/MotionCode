import { createContext, useContext, useState, ReactNode } from "react";
import { STRINGS, type Lang, type Strings } from "./i18n";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Strings;
}

export const LangContext = createContext<LangContextValue>({
    lang: "es",
  setLang: () => {},
    t: STRINGS.es,
});

export function LangProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Lang>("es");
  return (
    <LangContext.Provider value={{ lang, setLang, t: STRINGS[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
