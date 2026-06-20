import { serverMutation } from '../core/server';

export const createLesson = async (lessonData) => {
  return await serverMutation('/api/lessons', lessonData);
};

export const updateLesson = async (id, updatedFields) => {
  return await serverMutation(`/api/lessons/${id}`, updatedFields, 'PATCH');
};

export const deleteLesson = async (id) => {
  return await serverMutation(`/api/lessons/${id}`, {}, 'DELETE');
};

export const toggleLikeLesson = async (id) => {
  return await serverMutation(`/api/lessons/${id}/like`, {});
};
