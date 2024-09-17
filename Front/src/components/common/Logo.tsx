import webLogoLight from '../../assets/images/웹 로고 라이트.svg';

const Logo: React.FC = () => {
  return (
    <>
      <img
        src={webLogoLight}
        alt="webLogoLight"
        style={{ width: '207px', height: 'auto' }}
      />
    </>
  );
};

export default Logo;
