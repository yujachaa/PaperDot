import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { trueToggleBookmark, falseToggleBookmark } from '../apis/bookmark';

export const useBookmark = () => {
  const navigate = useNavigate();

  const clickBookmark = async (paperId: number, isBookmarked: boolean) => {
    try {
      if (isBookmarked) {
        await trueToggleBookmark(paperId);
      } else {
        await falseToggleBookmark(paperId);
      }
      // setIsBookmarked((prev) => !prev);
    } catch (error: any) {
      if (error.message === '로그인이 필요합니다') {
        toast.error(`${error.message} \n 로그인하러 가기`, {
          onClick: () => {
            toast.dismiss();
            navigate('/login');
          },
        });
      } else {
        toast.error(error.message);
      }
    }
  };

  return clickBookmark;
};
