import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, UserX, UserCheck, ArrowRight } from 'lucide-react';

const RecentActivityTable = ({ activity = [] }) => {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-black tracking-tight">Recent Customer Registrations</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Real-time account creation and authorization activity</p>
        </div>
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-1 text-xs font-semibold text-black hover:underline transition"
        >
          View All Directory <ArrowRight size={13} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50 text-zinc-500 font-semibold border-b border-zinc-200 uppercase tracking-wider text-[11px] font-mono">
            <tr>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Email & Contact</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">OTP State</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-700">
            {activity.length > 0 ? (
              activity.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="px-6 py-3.5 font-semibold text-black">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-zinc-100 text-black font-bold flex items-center justify-center text-xs uppercase border border-zinc-200 shrink-0">
                        {user.name ? user.name.charAt(0) : 'U'}
                      </div>
                      <span className="truncate max-w-[140px]">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-zinc-500 font-mono text-[11px]">
                    {user.email}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-zinc-100 text-zinc-800 border border-zinc-200">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    {user.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-black bg-zinc-100 px-2 py-0.5 rounded text-[11px] font-medium border border-zinc-200">
                        <ShieldCheck size={12} className="text-black" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded text-[11px] font-medium border border-zinc-200">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5">
                    {user.isBlocked ? (
                      <span className="inline-flex items-center gap-1 text-zinc-400 bg-zinc-100 line-through px-2 py-0.5 rounded text-[11px] font-medium border border-zinc-200">
                        <UserX size={12} /> Suspended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-black bg-zinc-100 px-2 py-0.5 rounded text-[11px] font-medium border border-zinc-200">
                        <UserCheck size={12} /> Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-right text-zinc-400 font-mono text-[11px]">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-10 text-zinc-400">
                  No recent customer activity recorded
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
