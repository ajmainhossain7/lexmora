import { serverMutation } from '../core/server';

export const toggleFavorite = async (lessonId) => {
  return await serverMutation('/api/favorites', { lessonId });
};
