'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Calendar, Plane, BarChart3 } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Wardrobe', href: '/wardrobe', icon: ShoppingBag },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Travel', href: '/travel', icon: Plane },
  { name: 'Stats', href: '/stats', icon: BarChart3 },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 md:bg-indigo-700">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-indigo-800">
            <h1 className="text-xl font-bold text-white">GetSet</h1>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-indigo-800 text-white'
                        : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
        <div className="flex justify-around">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center px-3 py-2 text-xs font-medium transition-colors ${
                  isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'
                }`}
              >
                <item.icon
                  className={`h-6 w-6 mb-1 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
