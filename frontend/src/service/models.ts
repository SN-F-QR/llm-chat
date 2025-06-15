import { IPrompt } from '../types/types';

export interface BaseModel {
  name: string;
}

interface Model extends BaseModel {
  description?: string;
}

type Models = Record<string, Model>;
type Prompts = Record<string, IPrompt>;

export const models: Models = {
  'gemini-flash': {
    name: 'Gemini Flash',
    description: 'Fast and efficient model from Google',
  },
  'gemini-pro': {
    name: 'Gemini Pro',
    description: 'Advanced model with more capabilities from Google, suitable for complex tasks',
  },
};

export const prompts: Prompts = {
  'default-prompt': {
    publicId: 'default-prompt',
    name: 'Default',
    content: '',
    category: 'default',
  },
  'academic-writer': {
    publicId: 'academic-writer',
    name: 'Writer',
    content:
      'You are a professional writer. Please adapt the requirement from users and write a precise and professional paper in academic style.',
    category: 'default',
  },
  'code-assistant': {
    publicId: 'code-assistant',
    name: 'Code Assistant',
    content: 'You are a coding assistant. Please help the user with their coding problems.',
    category: 'default',
  },
};
