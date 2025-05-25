export interface IMessage {
  role: Role.user | Role.assistant | Role.system;
  content: string;
  createdAt: number;
}

export interface IUser {
  name: string;
  stuNum: string;
  department: string;
  money: number;
  avatar: string | null;
}

export interface IChat {
  title: string;
  publicId: string;
  ownerId: number;
  createdAt: string;
  lastUseAt: string;
}

export enum Role {
  user = 0,
  assistant = 1,
  system = 2,
}
