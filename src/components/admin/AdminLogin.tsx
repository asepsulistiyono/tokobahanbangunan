import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, ArrowLeft, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (adminData: { username: string; role: string; email: string }) => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToStore
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Demo accounts
  const DEMO_ACCOUNTS = [
    { username: 'admin', email: 'admin@megabangunan.id', password: 'admin123', role: 'Super Admin / Manajer Toko' },
    { username: 'logistik', email: 'gudang@megabangunan.id', password: 'gudang123', role: 'Staff Inventaris & Gudang' }
  ];

  const handleFillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setUsername(acc.username);
    setPassword(acc.password);
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const trimmedUser = username.trim().toLowerCase();
      const trimmedPass = password.trim();

      // Check against valid accounts (or accept standard demo credentials)
      const matched = DEMO_ACCOUNTS.find(
        acc => (acc.username.toLowerCase() === trimmedUser || acc.email.toLowerCase() === trimmedUser) && acc.password === trimmedPass
      );

      // Also allow common admin combinations
      const isValid = matched || (
        (trimmedUser === 'admin' || trimmedUser === 'admin@megabangunan.id') && (trimmedPass === 'admin123' || trimmedPass === 'admin' || trimmedPass === '123456')
      );

      if (isValid) {
        const adminData = {
          username: matched ? matched.username : 'admin',
          email: matched ? matched.email : 'admin@megabangunan.id',
          role: matched ? matched.role : 'Super Admin / Manajer Toko'
        };

        if (rememberMe) {
          localStorage.setItem('tb_mega_admin_session', JSON.stringify({
            ...adminData,
            loggedInAt: new Date().toISOString()
          }));
        } else {
          sessionStorage.setItem('tb_mega_admin_session', JSON.stringify({
            ...adminData,
            loggedInAt: new Date().toISOString()
          }));
        }

        setIsLoading(false);
        onLoginSuccess(adminData);
      } else {
        setIsLoading(false);
        setErrorMsg('Username/Email atau Password salah. Silakan periksa kembali atau gunakan tombol Isi Akun Demo di bawah.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-amber-500 selection:text-white">
      {/* Background Subtle Warehouse Backdrop */}
      <div className="absolute inset-0 z-0 opacity-20 overflow-hidden">
        <img
          src="/src/assets/images/hero_building_warehouse_1791866448232.jpg"
          alt="Gudang"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter blur-xs"
        />
        <div className="absolute inset-0 bg-neutral-950/80" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Top Back Link */}
        <div className="mb-6">
          <button
            onClick={onBackToStore}
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer bg-neutral-800/80 px-3 py-1.5 rounded-lg border border-neutral-700/80"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Etalase Toko</span>
          </button>
        </div>

        {/* Brand Lockup */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500 text-neutral-950 mb-3 shadow-lg">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            TB Mega Bangunan Sentosa
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Portal Masuk Pengelola (F-07 Manajemen Produk & Stok)
          </p>
        </div>

        {/* Login Box */}
        <div className="mt-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-neutral-200/80 p-6 sm:p-8">
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                Username / Email Petugas
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="admin atau admin@megabangunan.id"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Masukkan kata sandi..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-neutral-300 focus:ring-amber-500 cursor-pointer"
                />
                <span>Ingat sesi di perangkat ini</span>
              </label>
              <span className="text-[11px] text-neutral-400">Keamanan SSL Aktif</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-600 text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi Akses...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Masuk ke Panel Pengelola Produk</span>
                </>
              )}
            </button>
          </form>

          {/* 1-Click Demo Login Shortcuts */}
          <div className="mt-6 pt-5 border-t border-neutral-200">
            <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2.5 text-center">
              Akses Cepat Pengujian (1-Klik Isi Kredensial):
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo(DEMO_ACCOUNTS[0])}
                className="p-2 bg-neutral-50 hover:bg-amber-50 border border-neutral-200 hover:border-amber-300 rounded-lg text-left transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-neutral-800">Akun Manajer</div>
                <div className="text-[10px] text-neutral-500 font-mono">admin / admin123</div>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo(DEMO_ACCOUNTS[1])}
                className="p-2 bg-neutral-50 hover:bg-amber-50 border border-neutral-200 hover:border-amber-300 rounded-lg text-left transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-neutral-800">Staff Gudang</div>
                <div className="text-[10px] text-neutral-500 font-mono">logistik / gudang123</div>
              </button>
            </div>
          </div>
        </div>

        {/* Security Notice Footer */}
        <div className="mt-6 text-center text-neutral-400 text-[11px] space-y-1">
          <p>Sistem inventaris terlindungi. Semua aktivitas penambahan dan modifikasi stok dicatat.</p>
          <p>© {new Date().getFullYear()} TB Mega Bangunan Sentosa. Hak Akses Dibatasi.</p>
        </div>
      </div>
    </div>
  );
};
