import style from './UserInfo.module.scss';
import Cancel from '../../assets/images/cancel.svg?react';
import { GroupMessage } from '../../interface/chat';
type UserInfoModalProps = {
  className?: string;
  onClose: () => void;
  position: { top: number; left: number };
  data: GroupMessage | null;
};

const UserInfoModal = ({ className, onClose, position, data }: UserInfoModalProps) => {
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
        <div>{data?.Writernickname}</div>
        <div className="cursor-pointer">별 보러 가기</div>
      </div>
    </div>
  );
};

export default UserInfoModal;
