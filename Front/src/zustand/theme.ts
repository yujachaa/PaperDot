import { create } from 'zustand';

type State = {
  isDarkMode: boolean;
};

type Actions = {
  toggleDarkMode: () => void;
};

const useTheme = create<State & Actions>((set) => ({
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));

export default useTheme;
