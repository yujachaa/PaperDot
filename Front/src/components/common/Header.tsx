import './Header.scss';
import LoginButton from './LoginButton';
import Logo from './Logo';
import CustomSwitch from './CustomSwitch';
import User from './User';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const loaction = useLocation();
  const isLoggedIn = useAuth();
  return (
    <div className="header">
      {loaction.pathname === '/' ? null : <Logo className="ml-16" />}

      <div className="header_right">
        <CustomSwitch />
        {isLoggedIn ? <User /> : <LoginButton />}
      </div>
    </div>
  );
};

export default Header;
