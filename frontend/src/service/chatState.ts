import { create } from 'zustand';

export interface ChatState {
  abortController: AbortController;
  resetAbort: () => void;
}

const useStore = create<ChatState>((set) => ({
  abortController: new AbortController(),
  resetAbort: () => set({ abortController: new AbortController() }),
}));

export default useStore;
