import './Header.scss';
import LoginButton from './LoginButton';
import Logo from './Logo';
import CustomSwitch from './CustomSwitch';

const Header = () => {
  return (
    <div className="header">
      <Logo />

      <div className="header_right">
        <CustomSwitch />
        <LoginButton />
      </div>
    </div>
  );
};

export default Header;
