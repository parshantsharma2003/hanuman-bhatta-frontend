import { redirect } from 'next/navigation';

export default function AdminInventoryRoute() {
  redirect('/admin?tab=inventory');
}
