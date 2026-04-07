'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  Warehouse,
  Phone,
  Calculator,
  Star,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  TrendingUp,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  Image as ImageIcon,
  Upload,
  ExternalLink,
} from 'lucide-react';
import AdminSidebar, { AdminNavItem } from '@/components/AdminSidebar';
import AdminTopBar from '@/components/AdminTopBar';

// Types
interface AdminUser {
  _id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin';
}

interface DashboardStats {
  products: { total: number; available: number };
  enquiries: { total: number; thisWeek: number };
  orders: { total: number; thisWeek: number };
  inventory: { totalBricks: number; availableTrolleys: number };
}

interface AdminAnalytics {
  interactions: {
    whatsappClicks: number;
    callClicks: number;
    orderClicks: number;
    calculatorUses: number;
  };
  business: {
    mostOrderedProduct: {
      name: string;
      totalBricks: number;
      totalOrders: number;
    };
    averageOrderSize: {
      bricks: number;
      trolleys: number;
    };
    peakEnquiryTime: string;
    conversionRate: number;
    totals: {
      enquiries: number;
      confirmedOrders: number;
    };
  };
}

interface Product {
  _id: string;
  name: string;
  type: string;
  pricePer1000: number;
  pricePerTrolley: number;
  availability: boolean;
  createdAt: string;
}

interface Enquiry {
  _id: string;
  name: string;
  phone: string;
  message: string;
  status?: string;
  notes?: string;
  createdAt: string;
}

interface Order {
  _id: string;
  name?: string;
  customerName?: string;
  phoneNumber?: string;
  phone?: string;
  email?: string;
  brickType?: 'Avval' | 'Second' | 'Rora';
  product?: string;
  deliveryArea?: string;
  address?: string;
  quantity: number;
  quantityBricks?: number;
  quantityTrolleys?: number;
  leadPriority?: 'hot' | 'warm' | 'normal';
  notes?: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface InventoryData {
  totalBricks: number;
  availableTrolleys: number;
}

interface GalleryItem {
  _id: string;
  type: 'image' | 'video';
  title?: string;
  description?: string;
  mediaUrl: string;
  publicId: string;
  createdAt: string;
}

// Main Component
export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'inventory' | 'enquiries' | 'orders' | 'gallery'>('dashboard');

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [adminAnalytics, setAdminAnalytics] = useState<AdminAnalytics | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryData | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://hanuman-bhatta-backend.onrender.com/api/v1' : 'http://localhost:5000/api/v1');

  // Authentication Check
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const tabParam = new URLSearchParams(window.location.search).get('tab');
    if (tabParam && ['dashboard', 'inventory', 'enquiries', 'orders'].includes(tabParam)) {
      setActiveTab(tabParam as 'dashboard' | 'inventory' | 'enquiries' | 'orders');
    }
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    window.history.replaceState({}, '', `${url.pathname}${url.search}`);
  }, [activeTab]);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/me`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
        setIsAuthenticated(true);
      } else {
        const error = await response.json();
        alert(error.message || 'Login failed');
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${apiBaseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Fetch Dashboard Data
  useEffect(() => {
    if (isAuthenticated && activeTab === 'dashboard') {
      fetchDashboardStats();
      fetchAdminAnalytics();
    } else if (isAuthenticated && activeTab === 'products') {
      fetchProducts();
    } else if (isAuthenticated && activeTab === 'enquiries') {
      fetchEnquiries();
    } else if (isAuthenticated && activeTab === 'orders') {
      fetchOrders();
    } else if (isAuthenticated && activeTab === 'inventory') {
      fetchInventory();
    } else if (isAuthenticated && activeTab === 'gallery') {
      fetchGallery();
    }
  }, [isAuthenticated, activeTab]);

  // Real-time analytics polling (every 12 seconds when on dashboard)
  useEffect(() => {
    if (!isAuthenticated || activeTab !== 'dashboard') return;

    // Fetch immediately on mount
    fetchAdminAnalytics();

    // Set up polling interval
    const analyticsInterval = setInterval(() => {
      fetchAdminAnalytics();
    }, 12000); // 12 seconds

    return () => {
      if (analyticsInterval) clearInterval(analyticsInterval);
    };
  }, [isAuthenticated, activeTab]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/stats`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchAdminAnalytics = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/analytics`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setAdminAnalytics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch admin analytics:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/products`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchEnquiries = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/enquiries`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setEnquiries(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch enquiries:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/orders`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/inventory`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setInventory(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    }
  };

  const fetchGallery = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/gallery`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setGalleryItems(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    }
  };

  // CRUD Operations
  const createProduct = async (productData: Partial<Product>) => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/products`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        fetchProducts();
        setModalType(null);
        alert('Product created successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create product');
      }
    } catch (error) {
      alert('Failed to create product');
    }
  };

  const updateProductPricing = async (id: string, pricing: { pricePer1000: number; pricePerTrolley: number; availability: boolean }) => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/products/${id}/pricing`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pricing),
      });

      if (response.ok) {
        fetchProducts();
        setModalType(null);
        alert('Product updated successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update product');
      }
    } catch (error) {
      alert('Failed to update product');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`${apiBaseUrl}/admin/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        fetchProducts();
        alert('Product deleted successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete product');
      }
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const updateEnquiry = async (id: string, updateData: { status?: string; notes?: string }) => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/enquiries/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        fetchEnquiries();
        setModalType(null);
        alert('Enquiry updated successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update enquiry');
      }
    } catch (error) {
      alert('Failed to update enquiry');
    }
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;

    try {
      const response = await fetch(`${apiBaseUrl}/admin/enquiries/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        fetchEnquiries();
        alert('Enquiry deleted successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete enquiry');
      }
    } catch (error) {
      alert('Failed to delete enquiry');
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      const response = await fetch(`${apiBaseUrl}/admin/orders/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        fetchOrders();
        alert('Order deleted successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete order');
      }
    } catch (error) {
      alert('Failed to delete order');
    }
  };

  const updateOrder = async (id: string, updateData: { status?: string; notes?: string }) => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/orders/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        fetchOrders();
        setModalType(null);
        alert('Order updated successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update order');
      }
    } catch (error) {
      alert('Failed to update order');
    }
  };

  const updateInventory = async (inventoryData: InventoryData) => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/inventory`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inventoryData),
      });

      if (response.ok) {
        fetchInventory();
        setModalType(null);
        alert('Inventory updated successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update inventory');
      }
    } catch (error) {
      alert('Failed to update inventory');
    }
  };

  // Gallery CRUD Operations
  const uploadGalleryItem = async (file: File, title?: string, description?: string) => {
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const fileData = reader.result;
        const response = await fetch(`${apiBaseUrl}/admin/gallery`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileData,
            title,
            description,
            type: file.type.startsWith('image/') ? 'image' : 'video',
          }),
        });

        if (response.ok) {
          fetchGallery();
          setModalType(null);
          alert('Gallery item uploaded successfully!');
        } else {
          const error = await response.json();
          alert(error.message || 'Failed to upload item');
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert('Failed to upload item');
    }
  };

  const updateGalleryItem = async (id: string, title?: string, description?: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/gallery/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        fetchGallery();
        setModalType(null);
        alert('Gallery item updated successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update item');
      }
    } catch (error) {
      alert('Failed to update item');
    }
  };

  const deleteGalleryItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      const response = await fetch(`${apiBaseUrl}/admin/gallery/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        fetchGallery();
        alert('Gallery item deleted successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete item');
      }
    } catch (error) {
      alert('Failed to delete item');
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-600"></div>
      </div>
    );
  }

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Sign in to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="admin@hanumanbhatta.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg"
            >
              Sign In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Main Dashboard
  const activeTitle =
    activeTab === 'dashboard'
      ? 'Dashboard Overview'
      : activeTab === 'products'
      ? 'Product Management'
      : activeTab === 'inventory'
      ? 'Inventory Management'
      : activeTab === 'enquiries'
      ? 'Customer Enquiries'
      : activeTab === 'orders'
      ? 'Order Management'
      : 'Gallery Management';

  const navItems: AdminNavItem[] = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      onClick: () => setActiveTab('dashboard'),
    },
    {
      key: 'products',
      label: 'Products',
      icon: <Package size={20} />,
      href: '/admin/products',
    },
    {
      key: 'gallery',
      label: 'Gallery',
      icon: <ImageIcon size={20} />,
      href: '/admin/gallery',
    },
    {
      key: 'activity',
      label: 'Activity Log',
      icon: <Clock size={20} />,
      href: '/admin/activity',
    },
    {
      key: 'inventory',
      label: 'Inventory',
      icon: <Warehouse size={20} />,
      onClick: () => setActiveTab('inventory'),
    },
    {
      key: 'enquiries',
      label: 'Enquiries',
      icon: <MessageSquare size={20} />,
      onClick: () => setActiveTab('enquiries'),
    },
    {
      key: 'orders',
      label: 'Orders',
      icon: <ShoppingCart size={20} />,
      onClick: () => setActiveTab('orders'),
    },
    {
      key: 'reviews',
      label: 'Reviews',
      icon: <Star size={20} />,
      href: '/admin/reviews',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      <AdminSidebar
        roleLabel={user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
        navItems={navItems}
        activeKey={activeTab}
        onLogout={handleLogout}
        mobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 min-w-0 lg:ml-64">
        <AdminTopBar
          title={activeTitle}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onLogout={handleLogout}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 lg:mb-8 hidden lg:flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{activeTitle}</h2>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.name}
              </p>
            </div>
            {activeTab === 'orders' && (
              <Link
                href="/admin/orders"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <ExternalLink size={18} /> Full Orders Dashboard
              </Link>
            )}
          </div>

          {/* Dashboard Content */}
          {activeTab === 'dashboard' && (
            <DashboardView stats={stats} analytics={adminAnalytics} />
          )}

          {activeTab === 'products' && (
            <ProductsView
              products={products}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSuperAdmin={user?.role === 'super_admin'}
              onCreateProduct={() => {
                setSelectedItem(null);
                setModalType('create');
              }}
              onEditProduct={(product: Product) => {
                setSelectedItem(product);
                setModalType('edit');
              }}
              onDeleteProduct={deleteProduct}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView
              inventory={inventory}
              onUpdateInventory={() => {
                setSelectedItem(inventory);
                setModalType('edit');
              }}
              onSaveInventory={updateInventory}
            />
          )}

          {activeTab === 'enquiries' && (
            <EnquiriesView
              enquiries={enquiries}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSuperAdmin={user?.role === 'super_admin'}
              onViewEnquiry={(enquiry: Enquiry) => {
                setSelectedItem(enquiry);
                setModalType('view');
              }}
              onEditEnquiry={(enquiry: Enquiry) => {
                setSelectedItem(enquiry);
                setModalType('edit');
              }}
              onDeleteEnquiry={deleteEnquiry}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersView
              orders={orders}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSuperAdmin={user?.role === 'super_admin'}
              onViewOrder={(order: Order) => {
                setSelectedItem(order);
                setModalType('view');
              }}
              onEditOrder={(order: Order) => {
                setSelectedItem(order);
                setModalType('edit');
              }}
              onDeleteOrder={deleteOrder}
            />
          )}

          {activeTab === 'gallery' && (
            <GalleryView
              galleryItems={galleryItems}
              onUpload={() => setModalType('create')}
              onEdit={(item: GalleryItem) => {
                setSelectedItem(item);
                setModalType('edit');
              }}
              onDelete={(id: string) => deleteGalleryItem(id)}
              onRefresh={fetchGallery}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modalType === 'create' && activeTab === 'products' && (
          <ProductModal
            onClose={() => setModalType(null)}
            onSave={createProduct}
          />
        )}

        {modalType === 'edit' && activeTab === 'products' && selectedItem && (
          <ProductModal
            product={selectedItem}
            onClose={() => setModalType(null)}
            onSave={(data: any) => updateProductPricing(selectedItem._id, data)}
          />
        )}

        {modalType === 'edit' && activeTab === 'inventory' && selectedItem && (
          <InventoryModal
            inventory={selectedItem}
            onClose={() => setModalType(null)}
            onSave={updateInventory}
          />
        )}

        {modalType === 'edit' && activeTab === 'enquiries' && selectedItem && (
          <EnquiryModal
            enquiry={selectedItem}
            onClose={() => setModalType(null)}
            onSave={(data: any) => updateEnquiry(selectedItem._id, data)}
          />
        )}

        {modalType === 'view' && activeTab === 'enquiries' && selectedItem && (
          <EnquiryViewModal
            enquiry={selectedItem}
            onClose={() => setModalType(null)}
          />
        )}

        {modalType === 'view' && activeTab === 'orders' && selectedItem && (
          <OrderViewModal
            order={selectedItem}
            onClose={() => setModalType(null)}
          />
        )}

        {modalType === 'edit' && activeTab === 'orders' && selectedItem && (
          <OrderUpdateModal
            order={selectedItem}
            onClose={() => setModalType(null)}
            onSave={(data: any) => updateOrder(selectedItem._id, data)}
          />
        )}

        {modalType === 'create' && activeTab === 'gallery' && (
          <GalleryUploadModal
            onClose={() => setModalType(null)}
            onSave={uploadGalleryItem}
          />
        )}

        {modalType === 'edit' && activeTab === 'gallery' && selectedItem && (
          <GalleryEditModal
            item={selectedItem}
            onClose={() => setModalType(null)}
            onSave={(data: any) => updateGalleryItem(selectedItem._id, data.title, data.description)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Navigation Item Component
function NavItem({ icon, label, active, onClick, href }: any) {
  if (href) {
    return (
      <Link
        href={href}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
          active
            ? 'bg-white text-orange-600 shadow-lg'
            : 'text-orange-100 hover:bg-orange-500'
        }`}
      >
        {icon}
        <span className="font-medium">{label}</span>
      </Link>
    );
  }
  
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active
          ? 'bg-white text-orange-600 shadow-lg'
          : 'text-orange-100 hover:bg-orange-500'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

// Dashboard View Component
function DashboardView({
  stats,
  analytics,
}: {
  stats: DashboardStats | null;
  analytics: AdminAnalytics | null;
}) {
  if (!stats) {
    return <div className="text-center py-12 text-gray-500">Loading statistics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Package className="text-blue-600" size={24} />}
          title="Total Products"
          value={stats.products.total}
          subtitle={`${stats.products.available} available`}
          color="blue"
        />
        <StatCard
          icon={<MessageSquare className="text-green-600" size={24} />}
          title="Enquiries"
          value={stats.enquiries.total}
          subtitle={`${stats.enquiries.thisWeek} this week`}
          color="green"
        />
        <StatCard
          icon={<ShoppingCart className="text-purple-600" size={24} />}
          title="Orders"
          value={stats.orders.total}
          subtitle={`${stats.orders.thisWeek} this week`}
          color="purple"
        />
        <StatCard
          icon={<Warehouse className="text-orange-600" size={24} />}
          title="Inventory"
          value={stats.inventory.totalBricks.toLocaleString()}
          subtitle={`${stats.inventory.availableTrolleys} trolleys`}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Product Availability</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {stats.products.available}/{stats.products.total}
                </p>
              </div>
              <BarChart3 className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Weekly Activity</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {stats.enquiries.thisWeek + stats.orders.thisWeek}
                </p>
              </div>
              <TrendingUp className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Bricks in Stock</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  {(stats.inventory.totalBricks / 1000).toFixed(1)}K
                </p>
              </div>
              <Warehouse className="text-purple-600" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Interaction Analytics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">CTA Interaction Analytics</h3>
        {analytics ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InsightCard
              title="WhatsApp Clicks"
              value={analytics.interactions.whatsappClicks.toLocaleString()}
              subtitle="High intent conversations"
              icon={<MessageSquare className="text-green-600" size={22} />}
              highlight={analytics.interactions.whatsappClicks >= analytics.interactions.callClicks}
            />
            <InsightCard
              title="Call Clicks"
              value={analytics.interactions.callClicks.toLocaleString()}
              subtitle="Direct call leads"
              icon={<Phone className="text-blue-600" size={22} />}
              highlight={analytics.interactions.callClicks > 0}
            />
            <InsightCard
              title="Order Button Clicks"
              value={analytics.interactions.orderClicks.toLocaleString()}
              subtitle="Quote/order intent"
              icon={<ShoppingCart className="text-purple-600" size={22} />}
              highlight={analytics.interactions.orderClicks > 0}
            />
            <InsightCard
              title="Calculator Uses"
              value={analytics.interactions.calculatorUses.toLocaleString()}
              subtitle="Planning engagement"
              icon={<Calculator className="text-orange-600" size={22} />}
              highlight={analytics.interactions.calculatorUses > 0}
            />
          </div>
        ) : (
          <div className="text-gray-500">Loading interaction analytics...</div>
        )}
      </div>

      {/* Business Analytics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Business Insights</h3>
        {analytics ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InsightCard
              title="Most Ordered Product"
              value={analytics.business.mostOrderedProduct.name}
              subtitle={`${analytics.business.mostOrderedProduct.totalBricks.toLocaleString()} bricks`}
              icon={<Star className="text-yellow-600" size={22} />}
              highlight={analytics.business.mostOrderedProduct.name !== 'N/A'}
            />
            <InsightCard
              title="Average Order Size"
              value={`${analytics.business.averageOrderSize.bricks.toLocaleString()} bricks`}
              subtitle={`${analytics.business.averageOrderSize.trolleys} trolleys avg`}
              icon={<Package className="text-indigo-600" size={22} />}
              highlight={analytics.business.averageOrderSize.bricks > 0}
            />
            <InsightCard
              title="Peak Enquiry Time"
              value={analytics.business.peakEnquiryTime}
              subtitle="Best team response window"
              icon={<Clock className="text-cyan-600" size={22} />}
              highlight={analytics.business.peakEnquiryTime !== 'N/A'}
            />
            <InsightCard
              title="Conversion Rate"
              value={`${analytics.business.conversionRate}%`}
              subtitle={`${analytics.business.totals.confirmedOrders}/${analytics.business.totals.enquiries} enquiries`}
              icon={<TrendingUp className="text-emerald-600" size={22} />}
              highlight={analytics.business.conversionRate >= 20}
            />
          </div>
        ) : (
          <div className="text-gray-500">Loading business insights...</div>
        )}
      </div>
    </div>
  );
}

function InsightCard({ title, value, subtitle, icon, highlight = false }: any) {
  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        highlight
          ? 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200'
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-gray-700">{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900 break-words">{value}</p>
      <p className="text-xs text-gray-600 mt-1">{subtitle}</p>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, title, value, subtitle, color }: any) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 min-h-[120px]">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Products View Component
function ProductsView({
  products,
  searchQuery,
  setSearchQuery,
  isSuperAdmin,
  onCreateProduct,
  onEditProduct,
  onDeleteProduct,
}: any) {
  const filteredProducts = products.filter((p: Product) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {isSuperAdmin && (
          <button
            onClick={onCreateProduct}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg"
          >
            <Plus size={20} />
            <span>Add Product</span>
          </button>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price/1000</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price/Trolley</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product: Product) => (
              <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{product.name}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">{product.type}</td>
                <td className="px-6 py-4 text-gray-900 font-semibold">₹{product.pricePer1000.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-900 font-semibold">₹{product.pricePerTrolley.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      product.availability
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {product.availability ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {product.availability ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEditProduct(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    {isSuperAdmin && (
                      <button
                        onClick={() => onDeleteProduct(product._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {searchQuery ? 'No products found matching your search' : 'No products available'}
          </div>
        )}
      </div>
    </div>
  );
}

// Inventory View Component
function InventoryView({ inventory, onUpdateInventory, onSaveInventory }: any) {
  const [formData, setFormData] = useState({
    totalBricks: inventory?.totalBricks || 0,
    availableTrolleys: inventory?.availableTrolleys || 0,
  });

  useEffect(() => {
    if (inventory) {
      setFormData({
        totalBricks: inventory.totalBricks || 0,
        availableTrolleys: inventory.availableTrolleys || 0,
      });
    }
  }, [inventory]);

  if (!inventory) {
    return <div className="text-center py-12 text-gray-500">Loading inventory...</div>;
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Total Bricks</h3>
            <Warehouse className="text-orange-600" size={32} />
          </div>
          <p className="text-4xl font-bold text-orange-600 mb-2">
            {inventory.totalBricks.toLocaleString()}
          </p>
          <p className="text-gray-600">Bricks in stock</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Available Trolleys</h3>
            <ShoppingCart className="text-orange-600" size={32} />
          </div>
          <p className="text-4xl font-bold text-orange-600 mb-2">
            {inventory.availableTrolleys}
          </p>
          <p className="text-gray-600">Trolleys available</p>
        </div>
      </div>

      <div className="lg:hidden space-y-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Total Bricks</label>
          <input
            type="number"
            min={0}
            value={formData.totalBricks}
            onChange={(e) => setFormData((prev) => ({ ...prev, totalBricks: Number(e.target.value) }))}
            className="w-full px-4 py-3 min-h-[44px] text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Available Trolleys</label>
          <input
            type="number"
            min={0}
            value={formData.availableTrolleys}
            onChange={(e) => setFormData((prev) => ({ ...prev, availableTrolleys: Number(e.target.value) }))}
            className="w-full px-4 py-3 min-h-[44px] text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="hidden lg:block">
        <button
          onClick={onUpdateInventory}
          className="w-full md:w-auto min-h-[44px] px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg"
        >
          Update Inventory
        </button>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
        <button
          onClick={() => onSaveInventory(formData)}
          className="w-full min-h-[44px] px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-semibold"
        >
          Update Inventory
        </button>
      </div>
    </div>
  );
}

// Enquiries View Component
function EnquiriesView({
  enquiries,
  searchQuery,
  setSearchQuery,
  isSuperAdmin,
  onViewEnquiry,
  onEditEnquiry,
  onDeleteEnquiry,
}: any) {
  const filteredEnquiries = enquiries.filter((e: Enquiry) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.phone.includes(searchQuery) ||
    e.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'contacted':
        return <Clock size={14} />;
      case 'resolved':
        return <CheckCircle size={14} />;
      case 'cancelled':
        return <XCircle size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'contacted':
        return 'bg-blue-100 text-blue-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search enquiries..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Mobile Enquiry Cards */}
      <div className="lg:hidden space-y-3">
        {filteredEnquiries.map((enquiry: Enquiry) => {
          const cleanPhone = enquiry.phone?.replace(/[^0-9]/g, '') || '';
          return (
            <div key={enquiry._id} className="bg-white rounded-xl shadow border border-gray-200 p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{enquiry.name}</p>
                  <p className="text-sm text-gray-600">{enquiry.phone}</p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    enquiry.status
                  )}`}
                >
                  {getStatusIcon(enquiry.status)}
                  {(enquiry.status || 'pending').charAt(0).toUpperCase() + (enquiry.status || 'pending').slice(1)}
                </span>
              </div>

              <p className="text-sm text-gray-700 line-clamp-2">{enquiry.message}</p>
              <p className="text-xs text-gray-500">{new Date(enquiry.createdAt).toLocaleString()}</p>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${enquiry.phone}`}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-100 text-green-700 font-medium"
                >
                  <Phone size={16} /> Call
                </a>
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-100 text-emerald-700 font-medium"
                >
                  <MessageSquare size={16} /> WhatsApp
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onViewEnquiry(enquiry)}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium"
                >
                  <Eye size={16} /> View
                </button>
                <button
                  onClick={() => onEditEnquiry(enquiry)}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-100 text-blue-700 font-medium"
                >
                  <Edit size={16} /> Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Enquiries Table */}
      <div className="hidden lg:block bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Message</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEnquiries.map((enquiry: Enquiry) => (
              <tr key={enquiry._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{enquiry.name}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">{enquiry.phone}</td>
                <td className="px-6 py-4">
                  <div className="max-w-xs truncate text-gray-600">{enquiry.message}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      enquiry.status
                    )}`}
                  >
                    {getStatusIcon(enquiry.status)}
                    {(enquiry.status || 'pending').charAt(0).toUpperCase() + (enquiry.status || 'pending').slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">
                  {new Date(enquiry.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewEnquiry(enquiry)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onEditEnquiry(enquiry)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    {isSuperAdmin && (
                      <button
                        onClick={() => onDeleteEnquiry(enquiry._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEnquiries.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {searchQuery ? 'No enquiries found matching your search' : 'No enquiries available'}
          </div>
        )}
      </div>

      {filteredEnquiries.length === 0 && (
        <div className="lg:hidden text-center py-8 text-gray-500 bg-white rounded-xl shadow-lg">
          {searchQuery ? 'No enquiries found matching your search' : 'No enquiries available'}
        </div>
      )}
    </div>
  );
}

// Orders View Component
function OrdersView({
  orders,
  searchQuery,
  setSearchQuery,
  isSuperAdmin,
  onViewOrder,
  onEditOrder,
  onDeleteOrder,
}: any) {
  const filteredOrders = orders.filter((o: Order) =>
    (o.name || o.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.phoneNumber || o.phone || '').includes(searchQuery) ||
    (o.brickType || o.product || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityBadge = (priority?: string) => {
    if (priority === 'hot') return 'bg-red-100 text-red-700';
    if (priority === 'warm') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getPriorityLabel = (priority?: string) => {
    if (priority === 'hot') return 'Hot';
    if (priority === 'warm') return 'Warm';
    return 'Normal';
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'in_progress':
        return 'bg-indigo-100 text-indigo-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search orders..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Mobile Orders Cards */}
      <div className="lg:hidden space-y-3">
        {filteredOrders.map((order: Order) => (
          <div key={order._id} className="bg-white rounded-xl shadow border border-gray-200 p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-900">{order.name || order.customerName || 'N/A'}</p>
                <p className="text-sm text-gray-600">{order.brickType || order.product || 'N/A'}</p>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadge(order.leadPriority)}`}>
                {getPriorityLabel(order.leadPriority)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Quantity</p>
                <p className="font-semibold text-gray-900">{order.quantityBricks || order.quantity || 0}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {(order.status || 'pending').replace('_', ' ')}
                </span>
              </div>
            </div>

            <button
              onClick={() => onViewOrder(order)}
              className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold"
            >
              <Eye size={16} /> View Details
            </button>
          </div>
        ))}
      </div>

      {/* Desktop Orders Table */}
      <div className="hidden lg:block bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Priority</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Brick Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Quantity</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Delivery Area</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order: Order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadge(order.leadPriority)}`}>
                    {getPriorityLabel(order.leadPriority)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{order.name || order.customerName || 'N/A'}</div>
                  <div className="text-xs text-gray-500 mt-1">{order.email || 'No email'}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">{order.phoneNumber || order.phone || 'N/A'}</td>
                <td className="px-6 py-4 text-gray-900">{order.brickType || order.product || 'N/A'}</td>
                <td className="px-6 py-4 text-gray-600">
                  {order.quantityBricks || order.quantity || 0} bricks
                  {order.quantityTrolleys ? ` (${Number(order.quantityTrolleys).toFixed(2)} trolleys)` : ''}
                </td>
                <td className="px-6 py-4 text-gray-600">{order.deliveryArea || order.address || 'N/A'}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {(order.status || 'pending').replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewOrder(order)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onEditOrder(order)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Update"
                    >
                      <Edit size={18} />
                    </button>
                    {isSuperAdmin && (
                      <button
                        onClick={() => onDeleteOrder(order._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {searchQuery ? 'No orders found matching your search' : 'No orders available'}
          </div>
        )}
      </div>

      {filteredOrders.length === 0 && (
        <div className="lg:hidden text-center py-8 text-gray-500 bg-white rounded-xl shadow-lg">
          {searchQuery ? 'No orders found matching your search' : 'No orders available'}
        </div>
      )}
    </div>
  );
}

// Gallery View Component
function GalleryView({ galleryItems, onUpload, onEdit, onDelete, onRefresh }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Gallery Items ({galleryItems.length})
          </h3>
          <p className="text-gray-600 text-sm mt-1">Manage your gallery images and videos</p>
        </div>
        <button
          onClick={onUpload}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg"
        >
          <Upload size={20} />
          Upload Media
        </button>
      </div>

      {galleryItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No gallery items yet</h3>
          <p className="text-gray-600 mb-6">Upload your first image or video to get started</p>
          <button
            onClick={onUpload}
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg"
          >
            Upload Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryItems.map((item: GalleryItem) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all"
            >
              <div className="relative aspect-square bg-gray-100">
                {item.type === 'image' ? (
                  <img
                    src={item.mediaUrl}
                    alt={item.title || 'Gallery image'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={item.mediaUrl}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-3 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors shadow-lg"
                    title="Edit"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => onDelete(item._id)}
                    className="p-3 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors shadow-lg"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {item.type === 'image' ? (
                    <ImageIcon size={16} className="text-orange-600" />
                  ) : (
                    <span className="text-orange-600 font-bold text-xs">VIDEO</span>
                  )}
                  <span className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {item.title && (
                  <h4 className="font-semibold text-gray-900 mb-1 truncate">{item.title}</h4>
                )}
                {item.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Product Modal Component
function ProductModal({ product, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    type: product?.type || '',
    pricePer1000: product?.pricePer1000 || 0,
    pricePerTrolley: product?.pricePerTrolley || 0,
    availability: product?.availability ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Create Product'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="First Class Bricks"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
            <input
              type="text"
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Premium Quality"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price per 1000</label>
            <input
              type="number"
              required
              min="0"
              value={formData.pricePer1000}
              onChange={(e) => setFormData({ ...formData, pricePer1000: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="8500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price per Trolley</label>
            <input
              type="number"
              required
              min="0"
              value={formData.pricePerTrolley}
              onChange={(e) => setFormData({ ...formData, pricePerTrolley: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="25500"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="availability"
              checked={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
              className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
            />
            <label htmlFor="availability" className="text-sm font-medium text-gray-700">
              Product Available
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg"
            >
              {product ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Inventory Modal Component
function InventoryModal({ inventory, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    totalBricks: inventory?.totalBricks || 0,
    availableTrolleys: inventory?.availableTrolleys || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Update Inventory</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Bricks</label>
            <input
              type="number"
              required
              min="0"
              value={formData.totalBricks}
              onChange={(e) => setFormData({ ...formData, totalBricks: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="100000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Trolleys</label>
            <input
              type="number"
              required
              min="0"
              value={formData.availableTrolleys}
              onChange={(e) => setFormData({ ...formData, availableTrolleys: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="50"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg"
            >
              Update
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Enquiry Modal Component
function EnquiryModal({ enquiry, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    status: enquiry?.status || 'pending',
    notes: enquiry?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Update Enquiry</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="resolved">Resolved</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Add notes about this enquiry..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg"
            >
              Update
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Enquiry View Modal Component
function EnquiryViewModal({ enquiry, onClose }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Enquiry Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Customer Name</p>
            <p className="text-gray-900 font-semibold">{enquiry.name}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Phone Number</p>
            <p className="text-gray-900 font-semibold">{enquiry.phone}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Message</p>
            <p className="text-gray-900">{enquiry.message}</p>
          </div>

          {enquiry.status && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
              <p className="text-gray-900 capitalize">{enquiry.status}</p>
            </div>
          )}

          {enquiry.notes && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Notes</p>
              <p className="text-gray-900">{enquiry.notes}</p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Received On</p>
            <p className="text-gray-900">{new Date(enquiry.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

// Order View Modal Component
// Order Update Modal Component
function OrderUpdateModal({ order, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    status: order?.status || 'pending',
    notes: order?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Update Order</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Internal Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Add internal notes about this order..."
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{formData.notes.length}/500 characters</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg"
            >
              Update
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function OrderViewModal({ order, onClose }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Order Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Customer Name</p>
            <p className="text-gray-900 font-semibold">{order.customerName || 'N/A'}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Phone Number</p>
            <p className="text-gray-900 font-semibold">{order.phone || 'N/A'}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Address</p>
            <p className="text-gray-900">{order.address || 'N/A'}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Product</p>
            <p className="text-gray-900 font-semibold">{order.product || 'N/A'}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Quantity</p>
            <p className="text-gray-900 font-semibold">{order.quantity || 0}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Price</p>
            <p className="text-gray-900 font-semibold text-lg">₹{(order.totalPrice || 0).toLocaleString()}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Order Date</p>
            <p className="text-gray-900">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

// Gallery Upload Modal Component
function GalleryUploadModal({ onClose, onSave }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxSize) {
        alert('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file');
      return;
    }
    onSave(file, formData.title, formData.description);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Upload Media</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Image or Video
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {preview && (
              <div className="mt-4 rounded-lg overflow-hidden">
                {file?.type.startsWith('image/') ? (
                  <img src={preview} alt="Preview" className="w-full h-auto" />
                ) : (
                  <video src={preview} controls className="w-full h-auto" />
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (Optional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Enter description..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg"
            >
              Upload
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Gallery Edit Modal Component
function GalleryEditModal({ item, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    description: item?.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Edit Gallery Item</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 rounded-lg overflow-hidden">
          {item.type === 'image' ? (
            <img src={item.mediaUrl} alt={item.title} className="w-full h-auto" />
          ) : (
            <video src={item.mediaUrl} controls className="w-full h-auto" />
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Enter description..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
