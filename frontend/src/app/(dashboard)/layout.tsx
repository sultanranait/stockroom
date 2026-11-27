import Header from '@/components/layout/Header';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Only checks the cookie is present; the API verifies it on every request
  const cookieStore = await cookies();
  if (!cookieStore.has('access_token')) {
    redirect('/login');
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </>
  );
}
