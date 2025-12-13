export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface Group {
  id: string;
  name: string;
  members: Array<{ user: User; role: string }>;
}

export interface Consumption {
  id: string;
  amount: number;
  description: string;
  date: string;
  userId: string;
  groupId?: string;
  user: User;
  group?: Group;
  createdAt: string;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: User;
  consumption?: Consumption;
}
