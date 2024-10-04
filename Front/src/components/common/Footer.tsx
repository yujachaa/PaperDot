import styles from './Footer.module.scss';

type FooterProps = {
  className?: string;
};
const Footer = ({ className }: FooterProps) => {
  return (
    <div className={`${styles.footer} ${className}`}>
      <div className="ml-4">문의사항, 버그제보 : paperdot.dev@gmail.com</div>
      <div className="ml-auto mr-4">Copyright © 2024. PAPERDOT All rights reserved.</div>
    </div>
  );
};

export default Footer;
