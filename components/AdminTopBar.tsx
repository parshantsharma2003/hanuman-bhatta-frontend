'use client';

import { LogOut, Menu } from 'lucide-react';

interface AdminTopBarProps {
  title: string;
  onMenuClick: () => void;
  onLogout: () => void;
}

export default function AdminTopBar({ title, onMenuClick, onLogout }: AdminTopBarProps) {
  return (
    <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-gray-200">
      <div className="px-4 h-16 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg border border-gray-200 text-gray-700"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-base font-semibold text-gray-900 truncate" aria-live="polite">
          {title}
        </h1>

        <button
          type="button"
          onClick={onLogout}
          className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg border border-gray-200 text-gray-700"
          aria-label="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
