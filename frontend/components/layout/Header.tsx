'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = auth.isAuthenticated();

  const handleLogout = () => {
    auth.removeToken();
    router.push('/');
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-xl font-bold">
              System Monitor
            </Link>
            <nav className="flex space-x-4">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === '/' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Dashboard
              </Link>
              {isAuthenticated && (
                <Link
                  href="/processes"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === '/processes' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  Processes
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

