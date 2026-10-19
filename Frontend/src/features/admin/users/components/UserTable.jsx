import React, { useState, useEffect } from 'react';
import userManagementService from '../services/userManagementService';
import {
  Search,
  RefreshCw,
  ShieldCheck,
  UserX,
  UserCheck,
  Filter,
  Phone,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    totalUsers: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
      };
      if (search.trim()) params.search = search.trim();
      if (roleFilter !== 'all') params.role = roleFilter;
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await userManagementService.getUsers(params);
      setUsers(res.users || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch user directory');
    } finally {
      setLoading(false);
    }
  };

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, statusFilter]);

  // Debounced fetch
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [search, roleFilter, statusFilter, page]);

  const handleToggleStatus = async (user) => {
    const actionLabel = user.isBlocked ? 'unblock' : 'suspend';
    if (!window.confirm(`Are you sure you want to ${actionLabel} account for ${user.name}?`)) {
      return;
    }

    try {
      setActionLoadingId(user._id || user.id);
      const res = await userManagementService.toggleUserStatus(user._id || user.id);
      toast.success(res.message);
      // Update local state smoothly
      setUsers((prev) =>
        prev.map((item) =>
          (item._id || item.id) === (user._id || user.id)
            ? { ...item, isBlocked: !item.isBlocked }
            : item
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${actionLabel} user`);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-zinc-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-black focus:bg-white transition text-zinc-900 placeholder:text-zinc-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-zinc-600">
            <Filter size={13} className="text-zinc-500" />
            <span className="font-medium">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 text-xs rounded-lg px-2.5 py-1.5 text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="user">Customers (user)</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-600">
            <span className="font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 text-xs rounded-lg px-2.5 py-1.5 text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active & Verified</option>
              <option value="unverified">Pending OTP</option>
              <option value="blocked">Suspended / Blocked</option>
            </select>
          </div>

          <button
            type="button"
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 bg-black hover:bg-zinc-800 text-white rounded-lg transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-zinc-50 text-zinc-500 font-semibold border-b border-zinc-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Customer Profile</th>
                <th className="px-5 py-3.5">Contact Details</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Email Verification</th>
                <th className="px-5 py-3.5">Account State</th>
                <th className="px-5 py-3.5">Joined Date</th>
                <th className="px-5 py-3.5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {users.length > 0 ? (
                users.map((item) => {
                  const id = item._id || item.id;
                  const isActionLoading = actionLoadingId === id;

                  return (
                    <tr key={id} className="hover:bg-zinc-50/60 transition">
                      {/* Name & Avatar */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 font-bold flex items-center justify-center uppercase text-xs">
                            {item.name ? item.name.charAt(0) : 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-black">{item.name}</p>
                            <p className="text-[10px] text-zinc-400 font-mono">ID: {id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-zinc-600">
                          <Mail size={12} className="text-zinc-400 shrink-0" />
                          <span>{item.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[11px]">
                          <Phone size={12} className="text-zinc-400 shrink-0" />
                          <span>{item.phone}</span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                            item.role === 'admin'
                              ? 'bg-black text-white'
                              : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                          }`}
                        >
                          {item.role}
                        </span>
                      </td>

                      {/* Verification Status */}
                      <td className="px-5 py-4">
                        {item.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-zinc-900 bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                            <ShieldCheck size={12} className="text-zinc-800" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-zinc-500 bg-zinc-50 border border-zinc-200 px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                            Pending OTP
                          </span>
                        )}
                      </td>

                      {/* Blocked / Active Status */}
                      <td className="px-5 py-4">
                        {item.isBlocked ? (
                          <span className="inline-flex items-center gap-1 text-black bg-zinc-200 border border-zinc-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                            <UserX size={12} /> Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-zinc-900 bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                            <UserCheck size={12} className="text-zinc-800" /> Active
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="px-5 py-4 text-zinc-500 text-[11px]">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} className="text-zinc-400" />
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Moderation Actions */}
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          disabled={isActionLoading || item.role === 'admin'}
                          title={
                            item.role === 'admin'
                              ? 'Admin accounts cannot be suspended'
                              : item.isBlocked
                              ? 'Restore account access'
                              : 'Suspend account'
                          }
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                            item.isBlocked
                              ? 'bg-black hover:bg-zinc-800 text-white'
                              : 'bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 hover:border-zinc-300'
                          }`}
                        >
                          {isActionLoading ? (
                            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                          ) : item.isBlocked ? (
                            <>
                              <UserCheck size={12} /> Unblock
                            </>
                          ) : (
                            <>
                              <UserX size={12} /> Block
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-400">
                    {loading ? 'Loading user directory...' : 'No accounts matching criteria'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <div>
            Showing <strong className="text-black">{users.length}</strong> of{' '}
            <strong className="text-black">{pagination.totalUsers}</strong> total registered accounts
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.hasPrevPage || loading}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-zinc-800 transition cursor-pointer"
            >
              <ChevronLeft size={14} /> Previous
            </button>

            <span className="px-3 py-1 bg-white border border-zinc-200 rounded-lg font-bold text-black">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={!pagination.hasNextPage || loading}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-zinc-800 transition cursor-pointer"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
