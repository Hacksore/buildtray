import styles from './index.module.scss';

export function Index() {
  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span> Hello there, </span>
              Welcome buildtray 👋
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
