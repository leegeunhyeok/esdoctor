import { Page } from '@/src/components/page';
import { ProjectOverviewCart } from './components/project-overview-card';
import { EnvironmentCart } from './components/environment-cart';
import { AlertsCard } from './components/alerts-card';
import { BundleOverviewCard } from './components/bundle-overview-card';
import { DurationCard } from './components/duration-card';

export function Overview() {
  return (
    <Page>
      <Page.Header>Overview</Page.Header>
      <Page.Content className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex flex-1 flex-col gap-4 lg:flex-2">
          <ProjectOverviewCart />
          <EnvironmentCart />
          <AlertsCard />
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <BundleOverviewCard />
          <DurationCard />
        </div>
      </Page.Content>
    </Page>
  );
}
