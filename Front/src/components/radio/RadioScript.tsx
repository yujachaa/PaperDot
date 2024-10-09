import styles from './RadioScript.module.scss';
import radio1 from '../../assets/images/radio1.png';
import radio2 from '../../assets/images/radio2.png';
import radio3 from '../../assets/images/radio3.png';
import radio4 from '../../assets/images/radio4.png';
import radio5 from '../../assets/images/radio5.png';
type RadioScriptProps = {
  className?: string;
  radioId: number;
};

const backgGound = (radioId: number) => {
  switch (radioId) {
    case 1:
      return radio1;
    case 2:
      return radio2;
    case 3:
      return radio3;
    case 4:
      return radio4;
    case 5:
      return radio5;
    default:
      return '';
  }
};
const RadioScript = ({ className, radioId }: RadioScriptProps) => {
  const imgSrc = backgGound(radioId);
  return (
    <img
      className={`${styles.box} ${className}`}
      src={imgSrc}
    />
  );
};

export default RadioScript;
