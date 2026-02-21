'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

export interface AdminNavItem {
  key: string;
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
}

interface AdminSidebarProps {
  roleLabel?: string;
  navItems: AdminNavItem[];
  activeKey?: string;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

function SidebarContent({ roleLabel, navItems, activeKey, onLogout, onNavigate }: {
  roleLabel?: string;
  navItems: AdminNavItem[];
  activeKey?: string;
  onLogout: () => void;
  onNavigate?: () => void;
}) {
  const renderNavItem = (item: AdminNavItem) => {
    const className = `w-full flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-lg transition-all ${
      activeKey === item.key
        ? 'bg-white text-orange-600 shadow-lg'
        : 'text-orange-100 hover:bg-orange-500'
    }`;

    if (item.href) {
      return (
        <Link key={item.key} href={item.href} className={className} onClick={onNavigate}>
          {item.icon}
          <span className="font-medium">{item.label}</span>
        </Link>
      );
    }

    return (
      <button
        key={item.key}
        onClick={() => {
          item.onClick?.();
          onNavigate?.();
        }}
        className={className}
      >
        {item.icon}
        <span className="font-medium">{item.label}</span>
      </button>
    );
  };

  return (
    <>
      <div className="p-6 border-b border-orange-500">
        <h1 className="text-2xl font-bold">Hanuman Bhatta</h1>
        <p className="text-sm text-orange-200 mt-1">{roleLabel || 'Admin'}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">{navItems.map(renderNavItem)}</nav>

      <div className="p-4 border-t border-orange-500">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 min-h-[44px] bg-orange-500 hover:bg-orange-400 rounded-lg transition-colors"
        >
          <span>Logout</span>
        </button>
      </div>
    </>
  );
}

export default function AdminSidebar({
  roleLabel,
  navItems,
  activeKey,
  onLogout,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  return (
    <>
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 bg-gradient-to-b from-orange-600 to-orange-700 text-white flex-col z-30">
        <SidebarContent
          roleLabel={roleLabel}
          navItems={navItems}
          activeKey={activeKey}
          onLogout={onLogout}
        />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close sidebar"
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-gradient-to-b from-orange-600 to-orange-700 text-white z-50 lg:hidden flex flex-col"
            >
              <div className="p-4 border-b border-orange-500 flex items-center justify-between">
                <p className="font-semibold">Menu</p>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="p-2 rounded-lg hover:bg-orange-500 min-h-[44px] min-w-[44px]"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              <SidebarContent
                roleLabel={roleLabel}
                navItems={navItems}
                activeKey={activeKey}
                onLogout={onLogout}
                onNavigate={onCloseMobile}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
