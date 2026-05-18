import { useSelector } from 'react-redux';

const ROLE_PERMISSIONS = {
  admin:       ['read', 'write', 'delete', 'ban', 'approve'],
  superadmin:  ['read', 'write', 'delete', 'ban', 'approve', 'manage_admins'],
};

export function usePermissions() {
  const admin = useSelector((state) => state.adminAuth?.admin);
  const role = (admin?.role || 'admin').toLowerCase();
  const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.admin;

  return {
    can: (action) => permissions.includes(action),
    role,
    isAdmin: role === 'admin' || role === 'superadmin',
  };
}
