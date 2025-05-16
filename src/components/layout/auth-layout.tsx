import * as React from 'react';
import logo from '@/assets/react.svg';
import { Link } from '@/components/ui/link';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  linkText: string;
  linkHref: string;
};

export const AuthLayout = ({ children, title, subtitle, linkText, linkHref }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="flex w-full items-center justify-center p-8 md:w-1/2">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-center md:justify-start">
            <Link className="flex items-center" to={'/'}>
              <img className="h-12 w-auto" src={logo} alt="Logo" />
            </Link>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-[hsl(var(--text-primary))]">{title}</h2>
            <p className="mt-2 text-[hsl(var(--text-secondary))]">{subtitle}</p>
          </div>

          <div className="rounded-lg bg-[hsl(var(--bg-base))] p-8 shadow-sm">{children}</div>

          <p className="text-center text-sm text-[hsl(var(--text-secondary))]">
            {linkText}{' '}
            <Link
              to={linkHref}
              className="font-medium text-[hsl(var(--bg-primary))] hover:text-[hsl(var(--bg-primary))]/80"
            >
              Klik disini
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden bg-[hsl(var(--bg-primary))] md:block md:w-1/2">
        <div className="flex h-full items-center justify-center p-8">
          <div className="text-[hsl(var(--text-white))]">
            <h3 className="mb-4 text-3xl font-bold">
              Selamat Datang di Aplikasi Pencatatan Keuangan
            </h3>
            <p className="text-[hsl(var(--text-white))]/80">
              Kelola keuangan Anda dengan lebih mudah dan efisien
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
