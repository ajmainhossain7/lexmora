import { serverMutation } from '../core/server';

export const updateUserRoleOrPlan = async (userId, updateData) => {
  return await serverMutation(`/api/admin/users/${userId}`, updateData, 'PATCH');
};
