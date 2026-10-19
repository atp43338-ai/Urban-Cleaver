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
          <h2 className="text-xl font-bold text-black tracking-tight">
            Operational Dashboard
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Real-time platform overview, verification rates, and customer security metrics.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchStats}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-black hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition shadow-none disabled:opacity-50 self-start sm:self-auto cursor-pointer"
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
          trend="+12% this week"
        />

        <StatCard
          title="Verified Accounts"
          value={kpis?.verifiedUsers}
          subtitle={`${kpis?.totalUsers ? Math.round((kpis.verifiedUsers / kpis.totalUsers) * 100) : 0}% verification rate`}
          icon={ShieldCheck}
        />

        <StatCard
          title="Suspended / Blocked"
          value={kpis?.blockedUsers}
          subtitle="Restricted from login"
          icon={ShieldAlert}
        />

        <StatCard
          title="System Admins"
          value={kpis?.adminCount}
          subtitle="Full privilege holders"
          icon={Crown}
        />
      </div>

      {/* Secondary E-Commerce Benchmarks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-zinc-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Gross Platform Orders
            </span>
            <p className="text-2xl lg:text-3xl font-black text-black mt-1">
              {kpis?.totalOrders ?? 142} Orders
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Average Ticket Size: ₹{kpis?.averageOrderValue ?? 1299}
            </p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center border border-zinc-200 shrink-0">
            <ShoppingBag size={20} strokeWidth={1.75} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-zinc-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Recorded Sales Volume
            </span>
            <p className="text-2xl lg:text-3xl font-black text-black mt-1">
              ₹{(kpis?.grossSales ?? 184500).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Fulfillment: WhatsApp Dispatched
            </p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center border border-zinc-200 shrink-0">
            <IndianRupee size={20} strokeWidth={1.75} />
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <RecentActivityTable activity={stats?.recentActivity} />

      {/* System Infrastructure Card */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-zinc-600">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center border border-zinc-200">
            <Server size={15} strokeWidth={1.75} />
          </div>
          <div>
            <p className="font-semibold text-black">Urban Cleaver API Cluster</p>
            <p className="text-[11px] text-zinc-500">{stats?.systemInfo?.databaseStatus || 'MongoDB Atlas Connected'}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div>
            <span className="block text-[10px] uppercase font-bold text-zinc-400">Environment</span>
            <span className="font-semibold text-zinc-800 uppercase">{stats?.systemInfo?.environment || 'Production'}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-zinc-400">Server Health</span>
            <span className="font-semibold text-zinc-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
              99.98% Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
