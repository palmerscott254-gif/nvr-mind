'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { User } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-slate-900 border-b border-blue-500/30 shadow-2xl shadow-blue-500/20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group smooth-transition">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:shadow-blue-500/80 smooth-transition">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold text-gradient group-hover:from-blue-300 group-hover:to-blue-100 smooth-transition">Scholsey</span>
              </div>
            </Link>
          </div>

          {!isLoading && (
            <div className="flex items-center gap-3 sm:gap-4">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-gray-300">{user.name || user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="relative text-gray-300 hover:text-red-400 text-sm font-medium smooth-transition group px-3 py-2"
                  >
                    <span className="relative">
                      Logout
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-400 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="relative text-gray-300 hover:text-blue-400 text-sm font-medium smooth-transition group px-3 py-2"
                  >
                    <span className="relative">
                      Login
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                  <Link href="/register" className="button-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
