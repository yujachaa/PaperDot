import styles from './RadioScript.module.scss';
import backGround from '../../assets/images/background.jpg';
type RadioScriptProps = {
  className?: string;
};

const RadioScript = ({ className }: RadioScriptProps) => {
  return (
    <img
      className={`${styles.box} ${className}`}
      src={backGround}
    />
  );
};

export default RadioScript;
