import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, UserX, UserCheck, ArrowRight, Calendar } from 'lucide-react';

const RecentActivityTable = ({ activity = [] }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Recent Customer Activity</h3>
          <p className="text-xs text-slate-500">Newly registered accounts and authorization events</p>
        </div>
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 transition"
        >
          View All Users <ArrowRight size={13} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Email & Contact</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Email OTP</th>
              <th className="px-5 py-3">Account State</th>
              <th className="px-5 py-3 text-right">Signed Up</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {activity.length > 0 ? (
              activity.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-3.5 font-semibold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs uppercase border border-slate-200">
                        {user.name ? user.name.charAt(0) : 'U'}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">
                    {user.email}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'admin'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {user.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] font-medium border border-emerald-200">
                        <ShieldCheck size={12} className="text-emerald-500" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-[11px] font-medium border border-amber-200">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {user.isBlocked ? (
                      <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded-full text-[11px] font-bold border border-red-200">
                        <UserX size={12} /> Suspended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] font-medium border border-emerald-200">
                        <UserCheck size={12} className="text-emerald-500" /> Active
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right text-slate-400 font-mono text-[11px]">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">
                  No recent activity recorded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivityTable;
