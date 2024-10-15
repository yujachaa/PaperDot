import { create } from 'zustand';

// 다크 모드 상태를 정의합니다.
type State = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkTrue: () => void;
  setDarkFalse: () => void;
};

// Zustand 스토어를 생성합니다.
const useTheme = create<State>((set) => {
  // localStorage에서 초기값을 불러옵니다.
  const storedDarkMode = localStorage.getItem('isDarkMode');
  const initialDarkMode = storedDarkMode ? JSON.parse(storedDarkMode) : false;

  return {
    isDarkMode: initialDarkMode,
    toggleDarkMode: () => {
      set((state) => {
        const newDarkMode = !state.isDarkMode;
        // 상태 변경 시 localStorage에 저장합니다.
        localStorage.setItem('isDarkMode', JSON.stringify(newDarkMode));
        return { isDarkMode: newDarkMode };
      });
    },
    setDarkTrue: () => {
      set({ isDarkMode: true });
      localStorage.setItem('isDarkMode', JSON.stringify(true)); // 상태를 저장합니다.
    },
    setDarkFalse: () => {
      set({ isDarkMode: false });
      localStorage.setItem('isDarkMode', JSON.stringify(false)); // 상태를 저장합니다.
    },
  };
});

export default useTheme;
