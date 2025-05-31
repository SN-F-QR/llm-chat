import { create } from 'zustand';

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
