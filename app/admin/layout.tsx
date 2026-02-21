import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard | Hanuman Bhatta',
    template: '%s | Admin | Hanuman Bhatta',
  },
  description: 'Hanuman Bhatta Admin Dashboard - Manage products, inventory, enquiries, and orders.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {children}
    </div>
  );
}
