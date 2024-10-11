import { toast } from 'react-toastify';
import { trueToggleBookmark, falseToggleBookmark } from '../apis/bookmark';

export const useBookmark = () => {
  const clickBookmark = async (paperId: number, isBookmarked: boolean) => {
    try {
      if (isBookmarked) {
        await trueToggleBookmark(paperId);
      } else {
        await falseToggleBookmark(paperId);
      }
      // setIsBookmarked((prev) => !prev);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return clickBookmark;
};
