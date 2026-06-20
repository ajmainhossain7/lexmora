import { serverMutation } from '../core/server';

export const createSubscription = async (subscriptionData) => {
  return await serverMutation('/api/subscriptions', subscriptionData);
};
