import { apiGet, apiPost } from './api-client';
import { Group, Message } from '../types/shared.types';

export const groupsApi = {
  getAll: () => apiGet<Group[]>('/groups'),
  create: (name: string) => apiPost<Group>('/groups', { name }),
  invite: (groupId: string, email: string) =>
    apiPost(`/groups/${groupId}/invite`, { email }),
  getMessages: (groupId: string) =>
    apiGet<Message[]>(`/groups/${groupId}/messages`),
  sendMessage: (groupId: string, content: string, consumptionId?: string) =>
    apiPost<Message>(`/groups/${groupId}/messages`, { content, consumptionId }),
  getOne: (groupId: string) => apiGet<Group>(`/groups/${groupId}`),
};

