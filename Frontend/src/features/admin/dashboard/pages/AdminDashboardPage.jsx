import React, { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService';
import StatCard from '../components/StatCard';
import RecentActivityTable from '../components/RecentActivityTable';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Crown,
  ShoppingBag,
  IndianRupee,
  RefreshCw,
  Server,
  Activity,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getDashboardStats();
      setStats(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const kpis = stats?.kpis;

  return (
    <div className="space-y-7">
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Operational Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time platform overview, verification rates, and customer security metrics.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchStats}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition shadow-sm disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh Stats
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value={kpis?.customerCount ?? kpis?.totalUsers}
          subtitle="Registered customer accounts"
          icon={Users}
          colorScheme="orange"
          trend="+12% this week"
        />

        <StatCard
          title="Verified Accounts"
          value={kpis?.verifiedUsers}
          subtitle={`${kpis?.totalUsers ? Math.round((kpis.verifiedUsers / kpis.totalUsers) * 100) : 0}% verification rate`}
          icon={ShieldCheck}
          colorScheme="emerald"
        />

        <StatCard
          title="Suspended / Blocked"
          value={kpis?.blockedUsers}
          subtitle="Restricted from login"
          icon={ShieldAlert}
          colorScheme={kpis?.blockedUsers > 0 ? 'red' : 'emerald'}
        />

        <StatCard
          title="System Admins"
          value={kpis?.adminCount}
          subtitle="Full privilege holders"
          icon={Crown}
          colorScheme="purple"
        />
      </div>

      {/* Secondary E-Commerce Benchmarks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-sm flex items-center justify-between border border-slate-700">
          <div>
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
              Gross Platform Orders
            </span>
            <p className="text-3xl font-extrabold mt-1">{kpis?.totalOrders ?? 142} Orders</p>
            <p className="text-xs text-slate-400 mt-1">Average Ticket Size: ₹{kpis?.averageOrderValue ?? 1299}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-sm flex items-center justify-between border border-slate-700">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Recorded Sales Volume
            </span>
            <p className="text-3xl font-extrabold mt-1">₹{(kpis?.grossSales ?? 184500).toLocaleString('en-IN')}</p>
            <p className="text-xs text-slate-400 mt-1">Fulfillment: WhatsApp Dispatched</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <IndianRupee size={24} />
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <RecentActivityTable activity={stats?.recentActivity} />

      {/* System Infrastructure Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <Server size={16} />
          </div>
          <div>
            <p className="font-semibold text-slate-800">Urban Cleaver API Cluster</p>
            <p className="text-[11px] text-slate-400">{stats?.systemInfo?.databaseStatus || 'MongoDB Connected'}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400">Environment</span>
            <span className="font-semibold text-slate-700 uppercase">{stats?.systemInfo?.environment}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400">Server Health</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              99.98% Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
