import { useState } from 'react';
import { TabBar } from './components/TabBar';
import { Overview } from './pages/Overview';
import { Analyze } from './pages/Analyze';

const pages = [
  {
    id: 'overview',
    label: 'Overview',
    component: Overview,
  },
  {
    id: 'analyze',
    label: 'Analyze',
    component: Analyze,
  },
];

const tabs = pages.map((page) => ({
  id: page.id,
  label: page.label,
}));

export function App() {
  const [activeTab, setActiveTab] = useState(pages[0].id);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
  };

  return (
    <div className="h-full w-full min-w-[800px]">
      <TabBar tabs={tabs} onTabClick={handleTabClick} />
      {pages.map(({ component: Component, id }) => (
        <div key={id} className={activeTab === id ? 'block' : 'hidden'}>
          <Component />
        </div>
      ))}
    </div>
  );
}
