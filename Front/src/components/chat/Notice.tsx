import style from './Notice.module.scss';
import Cancel from '../../assets/images/취소.svg?react';

type NoticeProps = {
  onClose: () => void;
};
export default function Notice({ onClose }: NoticeProps) {
  return (
    <div className={style.notice}>
      <div className={style.content}>
        <Cancel
          onClick={onClose}
          className="absolute top-1.5 right-1.5 cursor-pointer"
        />
        <div>공지사항입니다!</div>
        <div>
          <span className={style.command}>/ai</span> <span className={style.bold}>명령어</span>를
          사용해서 챗봇 전문가에게 질문을 해보세요!
        </div>
      </div>
    </div>
  );
}
