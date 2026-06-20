import { serverFetch } from '../core/server';

export const getPlans = async () => {
  return await serverFetch('/api/plans');
};
