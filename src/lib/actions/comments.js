import { serverMutation } from '../core/server';

export const createComment = async (commentData) => {
  return await serverMutation('/api/comments', commentData);
};
