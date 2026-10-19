import React from 'react';
import UserTable from '../components/UserTable';

const AdminUsersPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Customer Directory & Security</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage registered customer accounts, view verification states, and suspend unauthorized activity.
          </p>
        </div>
      </div>

      <UserTable />
    </div>
  );
};

export default AdminUsersPage;
