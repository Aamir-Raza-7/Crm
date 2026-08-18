import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Building2,
  TrendingUp,
  UserCheck,
  Activity,
  Phone,
  Mail,
  Calendar,
  Shield,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Users, label: 'Contacts', badge: '24' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: Settings, label: 'Settings' },
];

const stats = [
  { label: 'Total Contacts', value: '2,847', icon: Users, trend: '+12%', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  { label: 'Active Deals', value: '143', icon: TrendingUp, trend: '+8%', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { label: 'Customers', value: '986', icon: UserCheck, trend: '+5%', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  { label: 'Activities', value: '34', icon: Activity, trend: '+18%', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
];

const recentContacts = [
  { name: 'Arjun Mehta', role: 'CEO', company: 'TechNova', status: 'Active', avatar: 'AM' },
  { name: 'Priya Sharma', role: 'Manager', company: 'InnoSoft', status: 'Pending', avatar: 'PS' },
  { name: 'Rohan Verma', role: 'Director', company: 'DataPulse', status: 'Active', avatar: 'RV' },
  { name: 'Sneha Joshi', role: 'Analyst', company: 'CloudCore', status: 'Inactive', avatar: 'SJ' },
];

const statusColor = {
  Active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Pending: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  Inactive: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
};

function getInitials(name = '') {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully.');
      navigate('/login', { replace: true });
    } catch {
      toast.error('Logout failed. Please try again.');
    }
  };

  const userInitials = getInitials(user?.name);
  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })
    : 'N/A';

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      <Toaster position="top-right" />

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-slate-900 border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:sticky lg:flex`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white leading-none">CRM 2.0</p>
            <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">Customer Relations</p>
          </div>
          <button
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                item.active
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-600/30 text-indigo-300 text-[10px] font-semibold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User profile in sidebar */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0 overflow-y-auto">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md border-b border-white/5 flex items-center gap-4 px-4 lg:px-8 py-4">
          <button
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <h2 className="text-sm font-medium text-slate-400">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h2>
          </div>

          {/* Notification */}
          <button className="relative p-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
                {userInitials}
              </div>
              <span className="text-sm font-medium text-slate-300 hidden sm:block max-w-32 truncate">
                {user?.name}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform hidden sm:block ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-12 z-20 w-56 bg-slate-900 border border-white/10 rounded-2xl shadow-xl shadow-black/40 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {/* Welcome banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 mb-6 shadow-lg shadow-indigo-600/20">
            <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute right-12 bottom-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />
            <div className="relative">
              <p className="text-indigo-200 text-sm font-medium mb-1">Welcome back 👋</p>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                Hello, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-indigo-200 text-sm mt-2 max-w-md">
                Here's what's happening with your CRM today. You have{' '}
                <span className="font-semibold text-white">3 pending follow-ups</span> and{' '}
                <span className="font-semibold text-white">2 new leads</span>.
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl border p-5 ${stat.bg} flex flex-col gap-3`}
              >
                <div className="flex items-center justify-between">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {stat.trend}
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent contacts */}
            <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <h3 className="font-semibold text-white">Recent Contacts</h3>
                <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                  View all
                </button>
              </div>
              <div className="divide-y divide-white/5">
                {recentContacts.map((contact) => (
                  <div key={contact.name} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/2 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0">
                      {contact.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{contact.name}</p>
                      <p className="text-xs text-slate-500 truncate">{contact.role} · {contact.company}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${statusColor[contact.status]}`}>
                      {contact.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* User profile card */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/5">
                <h3 className="font-semibold text-white">Your Profile</h3>
              </div>
              <div className="p-5 flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-indigo-600/30">
                  {userInitials}
                </div>
                <div>
                  <p className="font-bold text-white text-lg">{user?.name}</p>
                  <p className="text-xs text-indigo-400 mt-0.5 flex items-center justify-center gap-1">
                    <Shield className="w-3 h-3" /> CRM Member
                  </p>
                </div>
              </div>

              <Separator className="bg-white/5" />

              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <p className="text-xs text-slate-400">{user?.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <p className="text-xs text-slate-400">Joined {joinedDate}</p>
                </div>
              </div>

              <div className="px-5 pb-5">
                <Button
                  onClick={handleLogout}
                  className="w-full h-9 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl text-sm font-medium transition-all duration-200"
                  variant="ghost"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
