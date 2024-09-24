import styles from './Script.module.scss';

type ScriptProps = {
  className?: string;
};

const Script = ({ className }: ScriptProps) => {
  return <div className={`${styles.box} ${className}`}></div>;
};

export default Script;
