import { serverFetch } from '../core/server';

export const getComments = async (lessonId) => {
  return await serverFetch(`/api/comments?lessonId=${lessonId}`);
};
