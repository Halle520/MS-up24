import { apiGet, apiPost } from './api-client';
import { Consumption } from '../types/shared.types';

export const consumptionApi = {
  getAll: () => apiGet<Consumption[]>('/consumption'),
  create: (data: { amount: number; description: string; date?: string; groupId?: string }) =>
    apiPost<Consumption>('/consumption', data),
};
