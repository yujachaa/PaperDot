import Header from '../components/common/Header';
import Logo from '../components/common/Logo';
import BestPaper from '../components/main/BestPaper';
import RadioChannelList from '../components/main/RadioChannelList';
import SearchBar from '../components/main/SearchBar';

const Main = () => {
  return (
    <>
      <Header />
      메인페이지
      <Logo />
      <SearchBar />
      <RadioChannelList />
      <BestPaper />
    </>
  );
};

export default Main;
