"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface Fragment {
  id: string;
  messsageId: string;
  sandboxUrl: string;
  title: string;
  files: any;
  createdAt: string;
  updatedAt: string;
}

interface FragmentContextType {
  selectedFragment: Fragment | null;
  setSelectedFragment: (fragment: Fragment | null) => void;
}

const FragmentContext = createContext<FragmentContextType | undefined>(
  undefined
);

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

export const useFragment = () => {
  const context = useContext(FragmentContext);
  if (context === undefined) {
    throw new Error("useFragment must be used within a FragmentProvider");
  }
  return context;
};
