import { create } from 'zustand';

type State = {
  loginId: number;
  setLoginId: (userId: number) => void;
};

const useLogin = create<State>()((set) => ({
  loginId: 0,
  setLoginId: (userId: number) => set({ loginId: userId }),
}));

export default useLogin;
