import { create } from 'zustand';

type BookmarkStore = {
  isBookmarked: boolean;
  setBookmark: (value: boolean) => void;
};

const usePaperBookmark = create<BookmarkStore>((set) => ({
  isBookmarked: false,
  setBookmark: (value: boolean) => set({ isBookmarked: value }),
}));

export default usePaperBookmark;
