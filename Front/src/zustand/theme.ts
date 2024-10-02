import { create } from 'zustand';

type State = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkTrue: () => void;
  setDarkFalse: () => void;
};

const useTheme = create<State>()((set) => ({
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setDarkTrue: () => set({ isDarkMode: true }),
  setDarkFalse: () => set({ isDarkMode: false }),
}));

export default useTheme;
