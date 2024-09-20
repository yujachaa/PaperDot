import styles from './RadioScript.module.scss';

type RadioScriptProps = {
  className?: string;
};

const RadioScript = ({ className }: RadioScriptProps) => {
  return <div className={`${styles.box} ${className}`}></div>;
};

export default RadioScript;
