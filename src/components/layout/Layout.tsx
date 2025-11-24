import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useStore } from '../../store/useStore';
import clsx from 'clsx';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export function Layout({ children, title }: LayoutProps) {
  const { sidebarCollapsed } = useStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Sidebar />
      <div
        className={clsx(
          'transition-all duration-300',
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        )}
      >
        <Header title={title} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
