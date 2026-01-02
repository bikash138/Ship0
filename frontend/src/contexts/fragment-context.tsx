"use client";

import { Fragment } from "@/types";
import { createContext, useContext, useState, ReactNode } from "react";

interface FragmentContextType {
  selectedFragment: Fragment | null;
  setSelectedFragment: (fragment: Fragment | null) => void;
}

const FragmentContext = createContext<FragmentContextType | null>(null);

export const FragmentProvider = ({ children }: { children: ReactNode }) => {
  const [selectedFragment, setSelectedFragment] = useState<Fragment | null>(
    null
  );

  return (
    <FragmentContext.Provider value={{ selectedFragment, setSelectedFragment }}>
      {children}
    </FragmentContext.Provider>
  );
};

export const useFragment = (): FragmentContextType => {
  const context = useContext(FragmentContext);
  if (!context) {
    throw new Error("useFragment must be used within a FragmentProvider");
  }
  return context;
};
