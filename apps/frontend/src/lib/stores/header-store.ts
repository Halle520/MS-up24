import { create } from 'zustand';
import { ReactNode } from 'react';

interface HeaderConfig {
  title?: string;
  customButtons?: ReactNode;
}

interface HeaderStore {
  config: HeaderConfig;
  setTitle: (title: string) => void;
  setCustomButtons: (buttons: ReactNode) => void;
  reset: () => void;
}

export const useHeaderStore = create<HeaderStore>((set) => ({
  config: {},
  setTitle: (title) => set((state) => ({ config: { ...state.config, title } })),
  setCustomButtons: (customButtons) => set((state) => ({ config: { ...state.config, customButtons } })),
  reset: () => set({ config: {} }),
}));

export const useHeader = () => {
  const store = useHeaderStore();
  return {
    setTitle: store.setTitle,
    setCustomButtons: store.setCustomButtons,
    resetHeader: store.reset,
  };
};
