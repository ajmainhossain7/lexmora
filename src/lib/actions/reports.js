import { serverMutation } from '../core/server';

export const createReport = async (reportData) => {
  return await serverMutation('/api/reports', reportData);
};

export const deleteReport = async (id) => {
  return await serverMutation(`/api/reports/${id}`, {}, 'DELETE');
};
