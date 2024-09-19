import styles from './BestPaper.module.scss';

const BestPaper = () => {
  return (
    <div className={styles.bestPaper}>
      <div className="text-xl font-bold leading-5">Best Paper of the Month</div>
      <p className="text-lg leading-5">This is a summary of the best paper.</p>
    </div>
  );
};

export default BestPaper;
