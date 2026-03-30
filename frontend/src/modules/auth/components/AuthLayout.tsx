import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type AuthLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="space-y-1 text-center">
          <Link className="text-sm font-medium text-slate-600 hover:text-slate-900" to="/">
            Wroc do strony glownej
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        {children}
        <p className="text-center text-sm text-slate-600">{footer}</p>
      </div>
    </main>
  );
}
