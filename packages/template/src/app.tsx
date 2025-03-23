import { memo } from 'react';
import { NavBar } from './components/navbar';
import { Overview } from './pages/overview';
import { Explorer } from './pages/explorer';
import { Timeline } from './pages/timeline';
import { TabProvider, useTab } from './hooks/use-tab';

const pages = [
  {
    id: 'overview',
    label: 'Overview',
    component: memo(Overview),
  },
  {
    id: 'timeline',
    label: 'Timeline',
    component: memo(Timeline),
  },
  {
    id: 'explorer',
    label: 'Explorer',
    component: memo(Explorer),
  },
];

const tabs = pages.map((page) => ({
  id: page.id,
  label: page.label,
}));

export function App() {
  return (
    <TabProvider initialTab={pages[0].id}>
      <TabPage />
    </TabProvider>
  );
}

function TabPage() {
  const { activeTab } = useTab();

  return (
    <div className="h-full w-full min-w-[800px]">
      <NavBar menus={tabs} />
      {pages.map(({ component: Component, id }) => (
        <div key={id} className={activeTab === id ? 'block' : 'hidden'}>
          <Component />
        </div>
      ))}
    </div>
  );
}
