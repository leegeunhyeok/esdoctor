import { TabBar } from './components/TabBar';
import { Overview } from './pages/Overview';

export function App() {
  return (
    <div className="h-full w-full min-w-[800px]">
      <TabBar />
      <Overview />
    </div>
  );
}
