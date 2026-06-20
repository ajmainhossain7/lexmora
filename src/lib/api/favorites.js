import { protectedFetch } from '../core/server';

export const getFavorites = async () => {
  return await protectedFetch('/api/favorites');
};

export const checkFavorite = async (lessonId) => {
  const data = await protectedFetch(`/api/favorites/check?lessonId=${lessonId}`);
  return data ? data.favorited : false;
};
