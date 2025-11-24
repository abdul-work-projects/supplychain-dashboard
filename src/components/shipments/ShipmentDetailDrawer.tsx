import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { format } from 'date-fns';
import {
  X,
  MapPin,
  Calendar,
  Truck,
  Ship,
  Plane,
  Train,
  Thermometer,
  Droplets,
  DoorOpen,
  Clock,
  Package,
  User,
  Phone,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Circle,
} from 'lucide-react';
import { Shipment, VehicleType } from '../../types';
import { useStore } from '../../store/useStore';
import { StatusBadge } from '../common/StatusBadge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import clsx from 'clsx';

const vehicleIcons: Record<VehicleType, React.ElementType> = {
  truck: Truck,
  ship: Ship,
  plane: Plane,
  train: Train,
};

const eventIcons: Record<string, React.ElementType> = {
  created: Circle,
  loaded: Package,
  departed: ArrowRight,
  checkpoint: MapPin,
  delay: AlertTriangle,
  arrived: MapPin,
  delivered: CheckCircle,
};

const eventColors: Record<string, string> = {
  created: 'text-gray-400',
  loaded: 'text-blue-500',
  departed: 'text-blue-500',
  checkpoint: 'text-blue-500',
  delay: 'text-red-500',
  arrived: 'text-green-500',
  delivered: 'text-green-500',
};

export function ShipmentDetailDrawer() {
  const { selectedShipment, isDetailDrawerOpen, setDetailDrawerOpen, darkMode } =
    useStore();

  if (!selectedShipment) return null;

  const VehicleIcon = vehicleIcons[selectedShipment.vehicle.type];

  const sensorData = selectedShipment.sensorData.map((d, i) => ({
    time: format(d.timestamp, 'HH:mm'),
    temperature: d.temperature,
    humidity: d.humidity,
  }));

  return (
    <Transition.Root show={isDetailDrawerOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setDetailDrawerOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-xl">
                  <div className="flex h-full flex-col bg-white dark:bg-dark-card shadow-xl overflow-y-auto">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border">
                      <div className="flex items-start justify-between">
                        <div>
                          <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                            {selectedShipment.id}
                          </Dialog.Title>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {selectedShipment.containerId}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={selectedShipment.status} />
                          <button
                            onClick={() => setDetailDrawerOpen(false)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border"
                          >
                            <X className="w-5 h-5 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 px-6 py-4 space-y-6">
                      {/* Route Info */}
                      <div className="card p-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                          Route Information
                        </h3>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Origin
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {selectedShipment.origin.city}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {selectedShipment.origin.country}
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Destination
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {selectedShipment.destination.city}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {selectedShipment.destination.country}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* ETA & Times */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="card p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Current ETA
                            </span>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {format(selectedShipment.eta, 'MMM d, yyyy')}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {format(selectedShipment.eta, 'h:mm a')}
                          </p>
                        </div>
                        <div className="card p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Original ETA
                            </span>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {format(selectedShipment.originalEta, 'MMM d, yyyy')}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {format(selectedShipment.originalEta, 'h:mm a')}
                          </p>
                        </div>
                      </div>

                      {/* Delay Reason */}
                      {selectedShipment.delayReason && (
                        <div className="card p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <span className="font-medium text-red-700 dark:text-red-400">
                              Delay Reason
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                            {selectedShipment.delayReason}
                          </p>
                        </div>
                      )}

                      {/* Vehicle Info */}
                      <div className="card p-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                          Vehicle Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-dark-border rounded-lg">
                              <VehicleIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Type
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white capitalize">
                                {selectedShipment.vehicle.type}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Vehicle ID
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white font-mono">
                              {selectedShipment.vehicle.id}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-dark-border rounded-lg">
                              <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Driver
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {selectedShipment.vehicle.driverName}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-dark-border rounded-lg">
                              <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Contact
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white text-sm">
                                {selectedShipment.vehicle.driverPhone}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-border">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                              Capacity
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {selectedShipment.vehicle.currentLoad.toLocaleString()} /{' '}
                              {selectedShipment.vehicle.capacity.toLocaleString()} units
                            </span>
                          </div>
                          <div className="mt-2 h-2 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-500 rounded-full"
                              style={{
                                width: `${(selectedShipment.vehicle.currentLoad / selectedShipment.vehicle.capacity) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Sensor Data */}
                      <div className="card p-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                          Sensor Data (Last 24h)
                        </h3>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-orange-500" />
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Temperature
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {selectedShipment.sensorData[selectedShipment.sensorData.length - 1]?.temperature.toFixed(1)}°C
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-blue-500" />
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Humidity
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {selectedShipment.sensorData[selectedShipment.sensorData.length - 1]?.humidity.toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <DoorOpen className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Door
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {selectedShipment.sensorData[selectedShipment.sensorData.length - 1]?.doorOpen
                                  ? 'Open'
                                  : 'Closed'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="h-32">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sensorData}>
                              <XAxis
                                dataKey="time"
                                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                              />
                              <YAxis
                                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: darkMode ? '#1e293b' : '#fff',
                                  border: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`,
                                  borderRadius: '8px',
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="temperature"
                                stroke="#f97316"
                                strokeWidth={2}
                                dot={false}
                              />
                              <Line
                                type="monotone"
                                dataKey="humidity"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Event Timeline */}
                      <div className="card p-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                          Event Timeline
                        </h3>
                        <div className="space-y-4">
                          {selectedShipment.events.map((event, index) => {
                            const Icon = eventIcons[event.type] || Circle;
                            return (
                              <div key={event.id} className="flex gap-3">
                                <div className="relative">
                                  <div
                                    className={clsx(
                                      'p-1.5 rounded-full bg-gray-100 dark:bg-dark-border',
                                      eventColors[event.type]
                                    )}
                                  >
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  {index < selectedShipment.events.length - 1 && (
                                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-200 dark:bg-dark-border" />
                                  )}
                                </div>
                                <div className="flex-1 pb-4">
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {event.description}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {format(event.timestamp, 'MMM d, yyyy h:mm a')}
                                  </p>
                                  {event.location && (
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                      {event.location.city}, {event.location.country}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Cargo Info */}
                      <div className="card p-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                          Cargo Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">
                              Description
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {selectedShipment.cargoDescription}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">
                              Weight
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {selectedShipment.weight.toLocaleString()} kg
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">
                              Value
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              ${selectedShipment.value.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">
                              Priority
                            </p>
                            <p
                              className={clsx(
                                'font-medium capitalize',
                                selectedShipment.priority === 'high' &&
                                  'text-red-600 dark:text-red-400',
                                selectedShipment.priority === 'medium' &&
                                  'text-yellow-600 dark:text-yellow-400',
                                selectedShipment.priority === 'low' &&
                                  'text-gray-600 dark:text-gray-400'
                              )}
                            >
                              {selectedShipment.priority}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
