import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Users, LogOut, Activity, User } from 'lucide-react';

export default function DoctorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/doctor/patients', label: 'Patient Directory', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900/40 backdrop-blur-md border-b md:border-b-0 md:border-r border-slate-900 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2 px-2 py-3 border-b border-slate-900">
            <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <span className="font-bold text-sm bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent tracking-wide">
              ONCOGEN CLINICAL
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 border ${
                    isActive
                      ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Doctor Identity & Logout */}
        <div className="mt-8 pt-4 border-t border-slate-900 space-y-4">
          <div className="flex items-center gap-2.5 px-2">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-slate-800 object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full border border-slate-800 bg-slate-950 flex items-center justify-center text-slate-500">
                <User className="w-4 h-4" />
              </div>
            )}
            <div className="truncate">
              <div className="text-xs font-bold text-slate-200 truncate">{user?.name}</div>
              <div className="text-[9px] text-slate-500 truncate">{user?.specialty}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-350 hover:bg-rose-500/5 rounded-lg border border-transparent hover:border-rose-500/10 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>

          <div className="text-center text-[9px] text-slate-600 font-mono pt-3 border-t border-slate-950/40 opacity-70">
            Developed by Satyam Pandey
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
