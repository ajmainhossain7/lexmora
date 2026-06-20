import { serverMutation } from '../core/server';

export const updateUserRoleOrPlan = async (userId, updateData) => {
  return await serverMutation(`/api/admin/users/${userId}`, updateData, 'PATCH');
};

export const deleteUser = async (userId) => {
  return await serverMutation(`/api/admin/users/${userId}`, {}, 'DELETE');
};
