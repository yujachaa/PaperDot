import userImage from '../../assets/images/유저 이미지.svg';

type UserProps = {
  className?: string;
};

const User = ({ className = '' }: UserProps) => {
  return (
    <img
      className={`w-14 h-14 ${className}`}
      src={userImage}
      alt="userImage"
    />
  );
};

export default User;
