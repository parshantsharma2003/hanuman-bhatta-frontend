'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Image as ImageIcon, RefreshCw, Clock3 } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/api/base';

interface ActivityLogItem {
  _id: string;
  actionType: 'price_change' | 'inventory_update' | 'product_archived' | 'product_restored';
  message: string;
  actorName: string;
  actorRole: 'super_admin' | 'admin' | 'system';
  metadata?: {
    productName?: string;
    previous?: {
      pricePer1000?: number;
      pricePerTrolley?: number;
      totalBricks?: number;
      availableTrolleys?: number;
    } | null;
    next?: {
      pricePer1000?: number;
      pricePerTrolley?: number;
      totalBricks?: number;
      availableTrolleys?: number;
    };
  };
  createdAt: string;
}

type ActionFilter = 'all' | 'price_change' | 'inventory_update' | 'product_archived' | 'product_restored';

const apiBaseUrl = getApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState<ActionFilter>('all');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/admin/activity-logs?limit=100`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activity logs');
      }

      const data = await response.json();
      setLogs(data.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    if (actionFilter === 'all') return logs;
    return logs.filter((log) => log.actionType === actionFilter);
  }, [logs, actionFilter]);

  const formatEventText = (log: ActivityLogItem) => {
    const actor = log.actorRole === 'system' ? 'System' : 'Admin';
    const time = new Date(log.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    if (log.actionType === 'price_change') {
      return `Price updated by ${actor} at ${time}`;
    }
    if (log.actionType === 'inventory_update') {
      return `Inventory updated by ${actor} at ${time}`;
    }
    if (log.actionType === 'product_archived') {
      return `Product archived by ${actor} at ${time}`;
    }
    return `Product restored by ${actor} at ${time}`;
  };

  const getBadgeClass = (actionType: ActivityLogItem['actionType']) => {
    if (actionType === 'price_change') return 'bg-blue-100 text-blue-700';
    if (actionType === 'inventory_update') return 'bg-purple-100 text-purple-700';
    if (actionType === 'product_archived') return 'bg-red-100 text-red-700';
    return 'bg-green-100 text-green-700';
  };

  const getBadgeLabel = (actionType: ActivityLogItem['actionType']) => {
    if (actionType === 'price_change') return 'Price';
    if (actionType === 'inventory_update') return 'Inventory';
    if (actionType === 'product_archived') return 'Archived';
    return 'Restored';
  };

  const filterCounts = {
    all: logs.length,
    price_change: logs.filter((log) => log.actionType === 'price_change').length,
    inventory_update: logs.filter((log) => log.actionType === 'inventory_update').length,
    product_archived: logs.filter((log) => log.actionType === 'product_archived').length,
    product_restored: logs.filter((log) => log.actionType === 'product_restored').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            href="/admin/products"
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
          >
            <Package size={20} />
            <span>Products</span>
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            href="/admin/gallery"
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ImageIcon size={20} />
            <span>Gallery</span>
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
            <p className="text-gray-600 mt-1">Audit trail for product prices, inventory, and archive actions</p>
          </div>
          <button
            onClick={fetchLogs}
            className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-3 rounded-lg font-semibold transition-colors"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-2 mb-6 inline-flex flex-wrap gap-2">
          {([
            ['all', 'All'],
            ['price_change', 'Price Changes'],
            ['inventory_update', 'Inventory Updates'],
            ['product_archived', 'Archived'],
            ['product_restored', 'Restored'],
          ] as [ActionFilter, string][]).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setActionFilter(value)}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                actionFilter === value ? 'bg-orange-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {label} ({filterCounts[value]})
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        )}

        {!loading && filteredLogs.length > 0 && (
          <div className="space-y-4">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-gray-900">{formatEventText(log)}</p>
                    <div className="mt-1 text-sm text-gray-600 flex items-center gap-2">
                      <Clock3 size={14} />
                      <span>{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeClass(log.actionType)}`}>
                    {getBadgeLabel(log.actionType)}
                  </span>
                </div>

                {(log.metadata?.productName || log.metadata?.previous || log.metadata?.next) && (
                  <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 space-y-1">
                    {log.metadata?.productName && (
                      <p>
                        <span className="font-semibold">Product:</span> {log.metadata.productName}
                      </p>
                    )}
                    {log.metadata?.previous && (
                      <p>
                        <span className="font-semibold">Previous:</span> {JSON.stringify(log.metadata.previous)}
                      </p>
                    )}
                    {log.metadata?.next && (
                      <p>
                        <span className="font-semibold">Updated:</span> {JSON.stringify(log.metadata.next)}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredLogs.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg text-center py-16 px-6">
            <Clock3 className="mx-auto text-gray-400 mb-3" size={32} />
            <h2 className="text-xl font-semibold text-gray-800">No Activity in this Filter</h2>
            <p className="text-gray-600 mt-2">Try another filter or refresh to load latest updates.</p>
          </div>
        )}
      </div>
    </div>
  );
}
