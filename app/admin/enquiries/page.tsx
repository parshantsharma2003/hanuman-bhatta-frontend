import { redirect } from 'next/navigation';

export default function AdminEnquiriesRoute() {
  redirect('/admin?tab=enquiries');
}
