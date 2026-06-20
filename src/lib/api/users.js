import { protectedFetch } from '../core/server';

export const getAdminUsers = async () => {
  return await protectedFetch('/api/admin/users');
};

export const getAdminStats = async () => {
  return await protectedFetch('/api/admin/stats');
};
