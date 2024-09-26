import './Header.scss';
import LoginButton from './LoginButton';
import Logo from './Logo';
import CustomSwitch from './CustomSwitch';
import User from './User';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const isLoggedIn = useAuth();

  return (
    <div className="header">
      <Logo className="ml-16" />

      <div className="header_right">
        <CustomSwitch />
        {isLoggedIn ? <User /> : <LoginButton />}
      </div>
    </div>
  );
};

export default Header;
