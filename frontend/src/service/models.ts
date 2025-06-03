interface Model {
  name: string;
  description?: string;
}

type Models = Record<string, Model>;

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
