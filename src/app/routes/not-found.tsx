import { paths } from '@/config/paths';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundRoute() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-[hsl(var(--bg-primary))]">404</p>
        <h1 className="mt-4 text-3xl font-bold text-[hsl(var(--text-primary))]">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-2 text-[hsl(var(--text-secondary))]">
          Maaf, halaman yang Anda cari tidak dapat ditemukan.
        </p>
        <Link to={paths.app.dashboard.getHref()}>
          <Button className="mt-6" icon={<Home className="size-4" />}>
            Kembali ke Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
