import styles from './SearhItem.module.scss';

interface Props {
  command: string;
  focus: boolean;
}

const SearchItem = ({ focus, command }: Props) => {
  return <div className={`${styles.command} ${focus && `${styles.focus}`}`}>{command}</div>;
};

export default SearchItem;
