'use client';

import Button from '@/components/ui/Button';
import Field, { controlClass } from '@/components/ui/Field';
import { useLogin } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    login.mutate(
      {
        email: String(form.get('email')),
        password: String(form.get('password')),
      },
      { onSuccess: () => router.replace('/products') },
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-5 rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Sign in to Stockroom
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage products and stock levels.
          </p>
        </div>

        <Field id="email" label="Email">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={controlClass}
          />
        </Field>

        <Field id="password" label="Password">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={controlClass}
          />
        </Field>

        {login.error && (
          <p role="alert" className="text-sm text-red-600">
            {login.error.message}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </main>
  );
}
