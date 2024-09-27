import MusicIconImage from '../../assets/images/volume.gif';

type MusicIconProps = {
  className?: string;
};

const MusicIcon = ({ className }: MusicIconProps) => {
  return (
    <>
      <img
        src={MusicIconImage}
        alt="음악볼륨바"
        className={`${className}`}
      />
    </>
  );
};

export default MusicIcon;
