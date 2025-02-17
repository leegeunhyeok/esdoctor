import { createContext, useContext, useState } from 'react';

const TabContext = createContext<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
}>({
  activeTab: '',
  setActiveTab: () => {},
});

export function TabProvider({
  children,
  initialTab,
}: {
  children: React.ReactNode;
  initialTab: string;
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTab() {
  const context = useContext(TabContext);

  if (context == null) {
    throw new Error('useTab must be used within a TabProvider');
  }

  return context;
}
