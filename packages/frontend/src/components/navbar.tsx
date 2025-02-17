import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { useTab } from '@/src/hooks/use-tab';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

interface TabBarProps {
  menus: MenuItem[];
  onMenuClick?: (id: string) => void;
}

export interface MenuItem {
  id: string;
  label: string;
}

export function NavBar({ menus }: TabBarProps) {
  const { activeTab, setActiveTab } = useTab();
  const activeIndex = menus.findIndex((menu) => menu.id === activeTab);

  const handleMenuClick = (id: string, index: number) => {
    setActiveTab?.(id);
  };

  return (
    <header className="flex items-center justify-between border-b px-8 py-4">
      <div className="flex items-center gap-4">
        <div className="-m-2 h-10 w-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="block h-full w-full"
            viewBox="0 0 200 200"
          >
            <circle cx="100" cy="100" r="100" fill="#FFCF00" />
            <polyline
              points="20,100 60,100 80,60 120,140 140,100 180,100"
              fill="none"
              stroke="#191919"
              stroke-width="24"
            />
          </svg>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            {menus.map(({ id, label }, index) => (
              <NavigationMenuItem key={id}>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    index !== activeIndex ? 'text-neutral-400' : '',
                    'cursor-pointer',
                  )}
                  onClick={() => handleMenuClick?.(id, index)}
                >
                  {label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex items-center gap-4">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            window.open('https://github.com/leegeunhyeok/esdoctor', '_blank');
          }}
        >
          <Github />
        </Button>
      </div>
    </header>
  );
}
