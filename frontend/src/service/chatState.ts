import { create } from 'zustand';

export interface ChatState {
  abortController: AbortController;
  resetAbort: () => void;
}

export interface DashboardState {
  expandChatList: boolean;
  setExpand: (setTo: boolean) => void;
}

export const useStore = create<ChatState>((set) => ({
  abortController: new AbortController(),
  resetAbort: () => set({ abortController: new AbortController() }),
}));

export const useDashboardStore = create<DashboardState>((set) => ({
  expandChatList: true,
  setExpand: (setTo: boolean) => set(() => ({ expandChatList: setTo })),
}));
