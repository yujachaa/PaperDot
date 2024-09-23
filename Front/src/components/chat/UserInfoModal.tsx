import style from './UserInfo.module.scss';
import Cancel from '../../assets/images/취소.svg?react';
type UserInfoModalProps = {
  className?: string;
  onClose: () => void;
  position: { top: number; left: number };
};

const UserInfoModal = ({ className, onClose, position }: UserInfoModalProps) => {
  return (
    <div
      className={`${style.box} ${className}`}
      style={{ top: position.top, left: position.left }}
    >
      <div className={`${style.content}`}>
        <Cancel
          onClick={onClose}
          className="absolute top-3 right-3 cursor-pointer"
        />
        <div>김싸피</div>
        <div>별 보러 가기</div>
      </div>
    </div>
  );
};

export default UserInfoModal;
