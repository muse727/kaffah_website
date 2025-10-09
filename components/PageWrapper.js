import styles from '../styles/PageWrapper.module.css';

const PageWrapper = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      {children}
    </div>
  );
};

export default PageWrapper;