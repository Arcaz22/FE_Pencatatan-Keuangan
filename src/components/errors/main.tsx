import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export const MainErrorFallback = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4" role="alert">
      <div className="text-center">
        <p className="text-6xl font-bold text-[hsl(var(--bg-destructive))]">Oops!</p>
        <h2 className="mt-4 text-2xl font-bold text-[hsl(var(--text-primary))]">
          Terjadi kesalahan
        </h2>
        <p className="mt-2 text-[hsl(var(--text-secondary))]">
          Maaf, telah terjadi kesalahan. Silakan coba refresh halaman.
        </p>
        <Button
          variant="destructive"
          className="mt-6"
          icon={<RefreshCw className="size-4" />}
          onClick={() => window.location.assign(window.location.origin)}
        >
          Refresh Halaman
        </Button>
      </div>
    </div>
  );
};
