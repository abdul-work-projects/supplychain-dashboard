import { Layout } from '../components/layout';
import { useStore } from '../store/useStore';
import { Sun, Moon, Monitor, Bell, Globe, User, Shield } from 'lucide-react';
import clsx from 'clsx';

export function Settings() {
  const { darkMode, toggleDarkMode } = useStore();

  return (
    <Layout title="Settings">
      <div className="max-w-4xl">
        {/* Appearance */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Sun className="w-5 h-5" />
            Appearance
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Theme
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => darkMode && toggleDarkMode()}
                  className={clsx(
                    'flex-1 p-4 rounded-xl border-2 transition-all',
                    !darkMode
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Sun className="w-8 h-8 text-yellow-500" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Light
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => !darkMode && toggleDarkMode()}
                  className={clsx(
                    'flex-1 p-4 rounded-xl border-2 transition-all',
                    darkMode
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Moon className="w-8 h-8 text-indigo-500" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Dark
                    </span>
                  </div>
                </button>

                <button
                  className="flex-1 p-4 rounded-xl border-2 border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600 transition-all opacity-50 cursor-not-allowed"
                  disabled
                >
                  <div className="flex flex-col items-center gap-2">
                    <Monitor className="w-8 h-8 text-gray-500" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      System
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h2>

          <div className="space-y-4">
            {[
              { label: 'Critical alerts', description: 'Get notified for critical shipment issues', defaultChecked: true },
              { label: 'Delay warnings', description: 'Receive alerts when shipments are at risk of delay', defaultChecked: true },
              { label: 'Warehouse alerts', description: 'Low stock and capacity notifications', defaultChecked: true },
              { label: 'Daily summary', description: 'Receive a daily summary of all operations', defaultChecked: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-dark-border last:border-0">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.label}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={item.defaultChecked}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Map Settings */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Map Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Map View
              </label>
              <select className="input w-full max-w-xs">
                <option>Global View</option>
                <option>North America</option>
                <option>Europe</option>
                <option>Asia Pacific</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-dark-border">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Show route lines
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Display planned routes on the map
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Cluster markers
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Group nearby shipments into clusters
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Account
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input type="text" defaultValue="Admin User" className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input type="email" defaultValue="admin@supplychain.com" className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <input type="text" defaultValue="Administrator" className="input w-full" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Region Access
              </label>
              <input type="text" defaultValue="Global" className="input w-full" disabled />
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Data & Privacy
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Refresh Rate
              </label>
              <select className="input w-full max-w-xs">
                <option>Real-time (1-5 seconds)</option>
                <option>Every 15 seconds</option>
                <option>Every 30 seconds</option>
                <option>Every minute</option>
              </select>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-dark-border">
              <button className="btn-secondary mr-3">
                Export Data
              </button>
              <button className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors">
                Clear Cache
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
