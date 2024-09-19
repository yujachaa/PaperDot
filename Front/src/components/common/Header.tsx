import './Header.scss';
import LoginButton from './LoginButton';
import Logo from './Logo';
import CustomSwitch from './CustomSwitch';
import User from './User';
const Header = () => {
  return (
    <div className="header">
      <Logo />
      <User />
      <div className="header_right">
        <CustomSwitch />
        <LoginButton />
      </div>
    </div>
  );
};

export default Header;
