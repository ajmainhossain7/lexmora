import { serverFetch, protectedFetch } from '../core/server';

export const getLessons = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.category && filters.category !== 'All') {
    params.append('category', filters.category);
  }
  if (filters.emotionalTone && filters.emotionalTone !== 'All') {
    params.append('emotionalTone', filters.emotionalTone);
  }
  if (filters.sortBy) {
    params.append('sortBy', filters.sortBy);
  }
  if (filters.page) {
    params.append('page', filters.page);
    params.append('perPage', filters.perPage || 12);
  }
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  return await serverFetch(`/api/lessons${queryString}`);
};

export const getLessonById = async (id) => {
  return await serverFetch(`/api/lessons/${id}`);
};

export const getMyLessons = async () => {
  return await protectedFetch('/api/my/lessons');
};

export const getFeaturedLessons = async () => {
  return await serverFetch('/api/lessons/featured');
};

export const getTopContributors = async () => {
  return await serverFetch('/api/lessons/top-contributors');
};

export const getMostSavedLessons = async () => {
  return await serverFetch('/api/lessons/most-saved');
};
