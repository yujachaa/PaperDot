import styles from './PlayListItem.module.scss';

type ListItem = {
  id: number;
  title: string;
  year: number;
  author: string;
};

type ListItemProps = {
  ListItem: ListItem;
};

const PlayListItem = ({ ListItem }: ListItemProps) => {
  const { title, year, author } = ListItem;
  return (
    <div className={`${styles.box} `}>
      <div>{title}</div>
      <div>{year}</div>
      <div>{author}</div>
    </div>
  );
};

export default PlayListItem;
