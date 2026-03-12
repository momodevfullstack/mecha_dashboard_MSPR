import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  selectedPlant: string;
  setSelectedPlant: (plant: string) => void;
  isLiveMode: boolean;
  setIsLiveMode: (live: boolean) => void;
  selectedMachineId: string | null;
  setSelectedMachineId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedPlant, setSelectedPlant] = useState<string>('All');
  const [isLiveMode, setIsLiveMode] = useState<boolean>(false);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);

  return (
    <AppContext.Provider
      value={{
        selectedPlant,
        setSelectedPlant,
        isLiveMode,
        setIsLiveMode,
        selectedMachineId,
        setSelectedMachineId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
