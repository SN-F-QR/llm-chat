export interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

export interface IUser {
  name: string;
  stuNum: string;
  department: string;
  money: number;
  avatar: string | null;
}
