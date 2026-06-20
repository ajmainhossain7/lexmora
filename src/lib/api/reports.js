import { protectedFetch } from '../core/server';

export const getReports = async () => {
  return await protectedFetch('/api/reports');
};
