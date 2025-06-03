import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { models } from './models';

export interface ChatState {
  isCreatingNewChat: boolean;
  setCreatingNewChat: (isGenerating: boolean) => void;
  abortController: AbortController;
  resetAbort: () => void;
}

export interface DashboardState {
  expandChatList: boolean;
  setExpand: (setTo: boolean) => void;
}

export interface UserPreferences {
  model: string;
  setModel: (model: string) => void;
}

export const useStore = create<ChatState>((set) => ({
  isCreatingNewChat: false,
  setCreatingNewChat: (newState: boolean) => {
    set({ isCreatingNewChat: newState });
  },
  abortController: new AbortController(),
  resetAbort: () => set({ abortController: new AbortController() }),
}));

export const useDashboardStore = create<DashboardState>((set) => ({
  expandChatList: true,
  setExpand: (setTo: boolean) => set(() => ({ expandChatList: setTo })),
}));

export const useUserPreferences = create<UserPreferences>()(
  persist(
    (set) => ({
      model: 'gemini-flash',
      setModel: (model: string) => {
        if (model in models) {
          set({ model: model });
        }
      },
    }),
    {
      name: 'user-preferences',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ model: state.model }),
    }
  )
);
