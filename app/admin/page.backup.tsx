'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  ClipboardList,
  Layers,
  Lock,
  LogOut,
  MessageCircle,
  Package,
  RefreshCcw,
  Truck,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { SkeletonStatCard, SkeletonListItem, SkeletonCard } from '@/components/Skeleton';

type AdminRole = 'super_admin' | 'admin';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

interface ProductItem {
  _id: string;
  name: string;
  type: string;
  pricePer1000: number;
  pricePerTrolley: number;
  availability?: boolean;
}

interface InventoryData {
  totalBricks: number;
  availableTrolleys: number;
  updatedAt?: string;
}

interface EnquiryItem {
  _id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
}

interface OrderItem {
  _id: string;
  fullName: string;
  mobileNumber: string;
  brickType: string;
  quantity: number;
  deliveryArea: string;
  status: string;
  createdAt: string;
}

const cardClass = 'bg-white border-2 border-sandy-300 rounded-2xl shadow-brick p-6';
const LOW_STOCK_THRESHOLD = 1000000;

export default function AdminDashboard() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  const [sessionChecked, setSessionChecked] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [inventory, setInventory] = useState<InventoryData | null>(null);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [productSaveState, setProductSaveState] = useState<Record<string, boolean>>({});
  const [inventorySaveState, setInventorySaveState] = useState(false);
  const [deleteProductState, setDeleteProductState] = useState<Record<string, boolean>>({});
  const [deleteOrderState, setDeleteOrderState] = useState<Record<string, boolean>>({});
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const canManagePrices = adminUser?.role === 'super_admin' || adminUser?.role === 'admin';
  const canManageInventory = adminUser?.role === 'super_admin' || adminUser?.role === 'admin';
  const canViewEnquiries = adminUser?.role === 'super_admin' || adminUser?.role === 'admin';
  const canViewOrders = adminUser?.role === 'super_admin' || adminUser?.role === 'admin';
  const canDeleteRecords = adminUser?.role === 'super_admin';

  const fetchWithAuth = async (url: string, options?: RequestInit) => {
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      credentials: 'include',
    });
  };

  const checkSession = async () => {
    try {
      const response = await fetchWithAuth(`${apiBaseUrl}/auth/me`);
      const result = await response.json();

      if (response.ok && result?.success) {
        setAdminUser(result.data);
      } else {
        setAdminUser(null);
      }
    } catch {
      setAdminUser(null);
    } finally {
      setSessionChecked(true);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch(`${apiBaseUrl}/products`, { cache: 'no-store' });
      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Unable to load products');
      }

      const items = (result.data || []) as ProductItem[];
      setProducts(items);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to load products');
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchInventory = async () => {
    setLoadingInventory(true);
    try {
      const response = await fetch(`${apiBaseUrl}/inventory`, { cache: 'no-store' });
      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Unable to load inventory');
      }

      setInventory(result.data || null);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to load inventory');
    } finally {
      setLoadingInventory(false);
    }
  };

  const fetchEnquiries = async () => {
    setLoadingEnquiries(true);
    try {
      const response = await fetchWithAuth(`${apiBaseUrl}/admin/enquiries?limit=50`);
      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Unable to load enquiries');
      }

      setEnquiries(result.data || []);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to load enquiries');
    } finally {
      setLoadingEnquiries(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await fetchWithAuth(`${apiBaseUrl}/admin/orders?limit=10`);
      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Unable to load orders');
      }

      setOrders(result.data || []);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to load orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadDashboardData = async () => {
    setActionError(null);
    setActionMessage(null);
    const tasks: Array<Promise<void>> = [];

    if (canManagePrices) {
      tasks.push(fetchProducts());
    }

    if (canManageInventory) {
      tasks.push(fetchInventory());
    }

    if (canViewEnquiries) {
      tasks.push(fetchEnquiries());
    }

    if (canViewOrders) {
      tasks.push(fetchOrders());
    }

    await Promise.all(tasks);
  };

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (adminUser) {
      loadDashboardData();
    }
  }, [adminUser]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const response = await fetchWithAuth(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Invalid login credentials');
      }

      setAdminUser(result.data);
      setLoginForm({ email: '', password: '' });
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetchWithAuth(`${apiBaseUrl}/auth/logout`, { method: 'POST' });
    setAdminUser(null);
    setSessionChecked(true);
  };

  const handleProductChange = (id: string, field: keyof ProductItem, value: string) => {
    setProducts((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              [field]: field === 'availability' ? value === 'true' : Number(value),
            }
          : item
      )
    );
  };

  const handleSaveProduct = async (product: ProductItem) => {
    if (!canManagePrices) {
      setActionError('You do not have permission to update product pricing.');
      return;
    }

    const confirmUpdate = window.confirm(
      `Update pricing for ${product.name}?\n` +
        `Price/1000: ${product.pricePer1000}\n` +
        `Price/Trolley: ${product.pricePerTrolley}\n` +
        `Availability: ${product.availability ? 'Available' : 'Out of stock'}`
    );

    if (!confirmUpdate) {
      return;
    }

    setProductSaveState((prev) => ({ ...prev, [product._id]: true }));
    setActionError(null);
    setActionMessage(null);

    try {
      const response = await fetchWithAuth(`${apiBaseUrl}/admin/products/${product._id}/pricing`, {
        method: 'PUT',
        body: JSON.stringify({
          pricePer1000: product.pricePer1000,
          pricePerTrolley: product.pricePerTrolley,
          availability: product.availability ?? true,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Unable to update product pricing');
      }

      setActionMessage('Product pricing updated successfully.');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to update product pricing');
    } finally {
      setProductSaveState((prev) => ({ ...prev, [product._id]: false }));
    }
  };

  const handleInventoryChange = (field: keyof InventoryData, value: string) => {
    setInventory((prev) => ({
      ...(prev || { totalBricks: 0, availableTrolleys: 0 }),
      [field]: Number(value),
    }));
  };

  const handleSaveInventory = async () => {
    if (!inventory) {
      return;
    }

    if (!canManageInventory) {
      setActionError('You do not have permission to update inventory.');
      return;
    }

    const confirmUpdate = window.confirm(
      `Update inventory?\nTotal bricks: ${inventory.totalBricks}\nAvailable trolleys: ${inventory.availableTrolleys}`
    );

    if (!confirmUpdate) {
      return;
    }

    setInventorySaveState(true);
    setActionError(null);
    setActionMessage(null);

    try {
      const response = await fetchWithAuth(`${apiBaseUrl}/admin/inventory`, {
        method: 'PUT',
        body: JSON.stringify({
          totalBricks: inventory.totalBricks,
          availableTrolleys: inventory.availableTrolleys,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Unable to update inventory');
      }

      setInventory(result.data || inventory);
      setActionMessage('Inventory updated successfully.');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to update inventory');
    } finally {
      setInventorySaveState(false);
    }
  };

  const handleDeleteProduct = async (product: ProductItem) => {
    if (!canDeleteRecords) {
      setActionError('You do not have permission to delete products.');
      return;
    }

    const confirmDelete = window.confirm(
      `Delete product "${product.name}"? This action cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    setDeleteProductState((prev) => ({ ...prev, [product._id]: true }));
    setActionError(null);
    setActionMessage(null);

    try {
      const response = await fetchWithAuth(`${apiBaseUrl}/admin/products/${product._id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Unable to delete product');
      }

      setProducts((prev) => prev.filter((item) => item._id !== product._id));
      setActionMessage('Product deleted successfully.');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to delete product');
    } finally {
      setDeleteProductState((prev) => ({ ...prev, [product._id]: false }));
    }
  };

  const handleDeleteOrder = async (order: OrderItem) => {
    if (!canDeleteRecords) {
      setActionError('You do not have permission to delete orders.');
      return;
    }

    const confirmDelete = window.confirm(
      `Delete order for ${order.fullName}? This action cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    setDeleteOrderState((prev) => ({ ...prev, [order._id]: true }));
    setActionError(null);
    setActionMessage(null);

    try {
      const response = await fetchWithAuth(`${apiBaseUrl}/admin/orders/${order._id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Unable to delete order');
      }

      setOrders((prev) => prev.filter((item) => item._id !== order._id));
      setActionMessage('Order deleted successfully.');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to delete order');
    } finally {
      setDeleteOrderState((prev) => ({ ...prev, [order._id]: false }));
    }
  };

  const inventoryUpdatedAt = useMemo(() => {
    if (!inventory?.updatedAt) {
      return 'Not available';
    }

    return new Date(inventory.updatedAt).toLocaleString('en-IN');
  }, [inventory]);

  const totalEnquiries = enquiries.length;
  const totalOrders = orders.length;
  const isLowStock = inventory ? inventory.totalBricks <= LOW_STOCK_THRESHOLD : false;
  const inventoryStatus = inventory ? (isLowStock ? 'Low Stock' : 'Healthy') : 'Unknown';
  const inventoryStatusClass = inventory
    ? isLowStock
      ? 'bg-red-100 text-red-700 border-red-200'
      : 'bg-green-100 text-green-700 border-green-200'
    : 'bg-sandy-100 text-charcoal-600 border-sandy-300';

  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-sandy flex items-center justify-center">
        <div className="text-charcoal font-semibold">Checking session...</div>
      </div>
    );
  }

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-terracotta/20 flex items-center justify-center">
              <Lock className="w-6 h-6 text-terracotta" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display">Admin Login</h1>
              <p className="text-sm text-sandy-100">Secure access for management</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-sandy-200 font-semibold">Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full mt-2 px-4 py-3 rounded-lg bg-white/90 text-charcoal font-semibold border-2 border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                placeholder="admin@hanumanbhatta.com"
                required
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-sandy-200 font-semibold">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                className="w-full mt-2 px-4 py-3 rounded-lg bg-white/90 text-charcoal font-semibold border-2 border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                placeholder="••••••••"
                required
              />
            </div>
            {loginError && <p className="text-xs text-red-300 font-semibold">{loginError}</p>}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-terracotta hover:bg-terracotta-dark text-white font-bold py-3 rounded-lg transition-colors shadow-brick"
            >
              {isLoggingIn ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sandy-50 via-white to-sandy-100">
      <header className="bg-charcoal-900 text-white py-6">
        <div className="container-custom flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display">Admin Dashboard</h1>
            <p className="text-sm text-sandy-200">Welcome back, {adminUser.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboardData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-sm font-semibold hover:bg-white/20 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-terracotta text-white text-sm font-semibold hover:bg-terracotta-dark transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container-custom py-10 space-y-8">
        {/* Notification Messages with Enhanced Animation */}
        <AnimatePresence mode="wait">
          {(actionMessage || actionError) && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`px-6 py-4 rounded-xl border-2 text-sm font-semibold flex items-center gap-3 ${
                actionError
                  ? 'bg-red-50 border-red-300 text-red-800'
                  : 'bg-green-50 border-green-300 text-green-800'
              }`}
            >
              {actionError ? (
                <XCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span>{actionError || actionMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Overview Cards with Skeleton Loading */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {loadingEnquiries || loadingOrders || loadingInventory ? (
            <>
              <SkeletonStatCard />
              <SkeletonStatCard />
              <SkeletonStatCard />
              <SkeletonStatCard />
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0 }}
                className={cardClass}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-charcoal-500 font-semibold">
                      Total Enquiries
                    </p>
                    <p className="text-3xl font-bold text-charcoal mt-2">
                      {canViewEnquiries ? totalEnquiries : '--'}
                    </p>
                    <p className="text-xs text-charcoal-500 mt-1">Last 50 records</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-terracotta" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className={cardClass}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-charcoal-500 font-semibold">
                      Inventory Status
                    </p>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold mt-2 ${inventoryStatusClass}`}>
                      {inventoryStatus}
                    </div>
                    <p className="text-xs text-charcoal-500 mt-2">
                      {inventory ? `${inventory.totalBricks.toLocaleString('en-IN')} bricks` : 'Not loaded'}
                    </p>
                    <p className="text-xs text-charcoal-500">
                      {inventory ? `${inventory.availableTrolleys.toLocaleString('en-IN')} trolleys` : ''}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center">
                    <Layers className="w-6 h-6 text-terracotta" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className={cardClass}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-charcoal-500 font-semibold">
                      Low Stock Warning
                    </p>
                    <p className="text-3xl font-bold text-charcoal mt-2">
                      {inventory ? (isLowStock ? 'Yes' : 'No') : '--'}
                    </p>
                    <p className="text-xs text-charcoal-500 mt-1">
                      Threshold: {LOW_STOCK_THRESHOLD.toLocaleString('en-IN')} bricks
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isLowStock ? 'bg-red-100' : 'bg-sandy-100'}`}>
                    <AlertTriangle className={`w-6 h-6 ${isLowStock ? 'text-red-600' : 'text-charcoal-400'}`} />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className={cardClass}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-charcoal-500 font-semibold">
                      Recent Orders
                    </p>
                    <p className="text-3xl font-bold text-charcoal mt-2">
                      {canViewOrders ? totalOrders : '--'}
                    </p>
                    <p className="text-xs text-charcoal-500 mt-1">Last 10 orders</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-terracotta" />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </section>

        {canManagePrices ? (
          <section className={cardClass}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-terracotta/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-terracotta" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-charcoal">Update Product Prices</h2>
              <p className="text-sm text-charcoal-600">Adjust live pricing and availability</p>
            </div>
          </div>

          {loadingProducts && (
            <div className="space-y-4">
              <SkeletonListItem />
              <SkeletonListItem />
              <SkeletonListItem />
            </div>
          )}

          {!loadingProducts && products.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
              <p className="text-sm text-charcoal-600">No products found</p>
            </div>
          )}

          <div className="space-y-4">
            {!loadingProducts && products.map((product) => (
              <motion.div 
                key={product._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border border-sandy-200 rounded-xl p-4 bg-sandy-50"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-charcoal">{product.name}</h3>
                    <p className="text-xs text-charcoal-600">Type: {product.type}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs uppercase text-charcoal-500 font-semibold">Price/1000</label>
                      <input
                        type="number"
                        min={0}
                        value={product.pricePer1000}
                        onChange={(event) => handleProductChange(product._id, 'pricePer1000', event.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-sandy-300 text-charcoal font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase text-charcoal-500 font-semibold">Price/Trolley</label>
                      <input
                        type="number"
                        min={0}
                        value={product.pricePerTrolley}
                        onChange={(event) => handleProductChange(product._id, 'pricePerTrolley', event.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-sandy-300 text-charcoal font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase text-charcoal-500 font-semibold">Availability</label>
                      <select
                        value={product.availability ? 'true' : 'false'}
                        onChange={(event) => handleProductChange(product._id, 'availability', event.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-sandy-300 text-charcoal font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                      >
                        <option value="true">Available</option>
                        <option value="false">Out of stock</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {canDeleteRecords && (
                      <button
                        onClick={() => handleDeleteProduct(product)}
                        disabled={deleteProductState[product._id]}
                        className="px-4 py-2 rounded-lg border-2 border-red-500 text-red-600 font-semibold hover:bg-red-50 transition-colors"
                      >
                        {deleteProductState[product._id] ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                    <button
                      onClick={() => handleSaveProduct(product)}
                      disabled={productSaveState[product._id]}
                      className="px-4 py-2 rounded-lg bg-terracotta text-white font-semibold hover:bg-terracotta-dark transition-colors"
                    >
                      {productSaveState[product._id] ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          </section>
        ) : (
          <section className={cardClass}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-terracotta/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-terracotta" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-charcoal">Update Product Prices</h2>
                <p className="text-sm text-charcoal-600">Adjust live pricing and availability</p>
              </div>
            </div>
            <p className="text-sm text-charcoal-600">You do not have permission to manage product pricing.</p>
          </section>
        )}

        {canManageInventory ? (
          <section className={cardClass}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-terracotta/10 flex items-center justify-center">
              <Truck className="w-5 h-5 text-terracotta" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-charcoal">Update Inventory</h2>
              <p className="text-sm text-charcoal-600">Keep live stock numbers accurate</p>
            </div>
          </div>

          {loadingInventory && <p className="text-sm text-charcoal-600">Loading inventory...</p>}

          {loadingInventory && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {!loadingInventory && inventory && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
            >
              <div>
                <label className="text-xs uppercase text-charcoal-500 font-semibold">Total Bricks</label>
                <input
                  type="number"
                  min={0}
                  value={inventory.totalBricks}
                  onChange={(event) => handleInventoryChange('totalBricks', event.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-sandy-300 text-charcoal font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-charcoal-500 font-semibold">Available Trolleys</label>
                <input
                  type="number"
                  min={0}
                  value={inventory.availableTrolleys}
                  onChange={(event) => handleInventoryChange('availableTrolleys', event.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-sandy-300 text-charcoal font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                />
              </div>
              <div>
                <button
                  onClick={handleSaveInventory}
                  disabled={inventorySaveState}
                  className="w-full px-4 py-2 rounded-lg bg-terracotta text-white font-semibold hover:bg-terracotta-dark transition-colors"
                >
                  {inventorySaveState ? 'Updating...' : 'Update Inventory'}
                </button>
                <p className="text-xs text-charcoal-500 mt-2">Last updated: {inventoryUpdatedAt}</p>
              </div>
            </motion.div>
          )}
          </section>
        ) : (
          <section className={cardClass}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-terracotta/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-terracotta" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-charcoal">Update Inventory</h2>
                <p className="text-sm text-charcoal-600">Keep live stock numbers accurate</p>
              </div>
            </div>
            <p className="text-sm text-charcoal-600">You do not have permission to manage inventory.</p>
          </section>
        )}

        {canViewOrders ? (
          <section className={cardClass}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-terracotta/10 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-terracotta" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-charcoal">Recent Orders</h2>
                <p className="text-sm text-charcoal-600">Latest customer orders</p>
              </div>
            </div>

            {loadingOrders && (
              <div className="space-y-4">
                <SkeletonListItem />
                <SkeletonListItem />
                <SkeletonListItem />
              </div>
            )}

            {!loadingOrders && orders.length === 0 && (
              <div className="text-center py-8">
                <ClipboardList className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
                <p className="text-sm text-charcoal-600">No recent orders found</p>
              </div>
            )}

            <div className="space-y-4">
              {!loadingOrders && orders.map((order) => (
                <div key={order._id} className="border border-sandy-200 rounded-xl p-4 bg-white">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-charcoal">{order.fullName}</p>
                      <p className="text-xs text-charcoal-600">{order.mobileNumber}</p>
                      <p className="text-xs text-charcoal-500 mt-1">
                        {order.deliveryArea}
                      </p>
                    </div>
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-charcoal-600">
                      <div>
                        <p className="uppercase text-[10px] text-charcoal-400">Brick Type</p>
                        <p className="font-semibold text-charcoal">{order.brickType}</p>
                      </div>
                      <div>
                        <p className="uppercase text-[10px] text-charcoal-400">Quantity</p>
                        <p className="font-semibold text-charcoal">{order.quantity}</p>
                      </div>
                      <div>
                        <p className="uppercase text-[10px] text-charcoal-400">Status</p>
                        <p className="font-semibold text-charcoal">{order.status}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-2 text-xs text-charcoal-500">
                      <span>{new Date(order.createdAt).toLocaleString('en-IN')}</span>
                      {canDeleteRecords && (
                        <button
                          onClick={() => handleDeleteOrder(order)}
                          disabled={deleteOrderState[order._id]}
                          className="px-3 py-1 rounded-lg border border-red-500 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors"
                        >
                          {deleteOrderState[order._id] ? 'Deleting...' : 'Delete'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className={cardClass}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-terracotta/10 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-terracotta" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-charcoal">Recent Orders</h2>
                <p className="text-sm text-charcoal-600">Latest customer orders</p>
              </div>
            </div>
            <p className="text-sm text-charcoal-600">You do not have permission to view orders.</p>
          </section>
        )}

        {canViewEnquiries ? (
          <section className={cardClass}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-terracotta/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-terracotta" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-charcoal">Customer Enquiries</h2>
              <p className="text-sm text-charcoal-600">Latest messages from the website</p>
            </div>
          </div>

          {loadingEnquiries && (
            <div className="space-y-4">
              <SkeletonListItem />
              <SkeletonListItem />
              <SkeletonListItem />
            </div>
          )}

          {!loadingEnquiries && enquiries.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
              <p className="text-sm text-charcoal-600">No enquiries yet</p>
            </div>
          )}

          <div className="space-y-4">
            {!loadingEnquiries && enquiries.map((enquiry) => (
              <div key={enquiry._id} className="border border-sandy-200 rounded-xl p-4 bg-white">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-charcoal">{enquiry.name}</p>
                    <p className="text-xs text-charcoal-600">{enquiry.phone}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-charcoal-700 break-words">{enquiry.message}</p>
                  </div>
                  <div className="text-xs text-charcoal-500">
                    {new Date(enquiry.createdAt).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
          </section>
        ) : (
          <section className={cardClass}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-terracotta/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-terracotta" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-charcoal">Customer Enquiries</h2>
                <p className="text-sm text-charcoal-600">Latest messages from the website</p>
              </div>
            </div>
            <p className="text-sm text-charcoal-600">You do not have permission to view enquiries.</p>
          </section>
        )}
      </main>
    </div>
  );
}
