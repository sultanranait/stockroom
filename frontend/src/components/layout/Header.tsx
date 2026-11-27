'use client';

import Button from '@/components/ui/Button';
import { useCurrentUser, useLogout } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  const onLogout = () => {
    logout.mutate(undefined, { onSuccess: () => router.replace('/login') });
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/products" className="font-semibold tracking-tight">
          Stockroom
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {user && (
            <span className="text-slate-600">
              {user.name}
              <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500 capitalize">
                {user.role}
              </span>
            </span>
          )}
          <Button
            variant="secondary"
            onClick={onLogout}
            disabled={logout.isPending}
          >
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}
