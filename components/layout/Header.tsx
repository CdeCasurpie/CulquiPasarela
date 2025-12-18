'use client';

import { useAuth } from '@/hooks/useAuth';
import { LogOut, User } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  return (
    <header className="bg-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-3xl">💳</div>
            <h1 className="text-2xl font-bold text-white">
              Culqi<span className="text-yellow-500">Pay</span>
            </h1>
          </div>

          {/* Usuario */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-right">
              <User className="text-yellow-500" size={20} />
              <div>
                <p className="text-sm text-slate-400">Bienvenido</p>
                <p className="text-white font-medium">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 transition-colors flex items-center gap-2"
            >
              <LogOut size={18} />
              Salir
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
