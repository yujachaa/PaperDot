import styles from './SearhItem.module.scss';

interface Props {
  command: string;
  focus: boolean;
  onClick: (command: string) => void;
}

const SearchItem = ({ focus, command, onClick }: Props) => {
  return (
    <div
      onClick={() => onClick(command)}
      className={`${styles.command} ${focus && `${styles.focus}`}`}
    >
      {command}
    </div>
  );
};

export default SearchItem;
