import Footer from '../components/common/Footer';
import Header from '../components/common/Header';
import Logo from '../components/common/Logo';
import BestPaper from '../components/main/BestPaper';
import RadioChannelList from '../components/main/RadioChannelList';
import SearchBar from '../components/main/SearchBar';
import styles from './Main.module.scss';

const Main = () => {
  return (
    <div className={styles.container}>
      <Header />
      <Logo />
      <SearchBar />
      <RadioChannelList />
      <BestPaper />
      <Footer />
    </div>
  );
};

export default Main;
