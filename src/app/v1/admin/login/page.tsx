import { redirect } from 'next/navigation';

/**
 * /v1/admin/login on the frontend host is not an API route — redirect to admin UI.
 */
export default function V1AdminLoginRedirect() {
  redirect('/admin/login');
}
