import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Map,
  Warehouse,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Truck
} from 'lucide-react';
import { useStore, useUnacknowledgedAlerts } from '../../store/useStore';
import clsx from 'clsx';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/shipments', icon: Package, label: 'Shipments' },
  { path: '/map', icon: Map, label: 'Map View' },
  { path: '/warehouses', icon: Warehouse, label: 'Warehouses' },
  { path: '/alerts', icon: Bell, label: 'Alerts' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useStore();
  const unacknowledgedAlerts = useUnacknowledgedAlerts();

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-screen bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border transition-all duration-300 z-40',
        sidebarCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <Truck className="w-6 h-6 text-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              SupplyChain
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'nav-item',
                isActive && 'nav-item-active',
                sidebarCollapsed && 'justify-center px-0'
              )
            }
          >
            <div className="relative">
              <item.icon className="w-5 h-5" />
              {item.label === 'Alerts' && unacknowledgedAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unacknowledgedAlerts.length > 9 ? '9+' : unacknowledgedAlerts.length}
                </span>
              )}
            </div>
            {!sidebarCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute bottom-4 right-0 translate-x-1/2 w-8 h-8 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
}
