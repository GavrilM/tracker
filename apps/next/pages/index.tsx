import styles from '../styles/landing.module.css'

export default function() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <nav className={styles.nav}>
          <span className={styles.logoType}>Lifelog</span>
          <a href="/login?type=login" className={styles.buttonSecondary}>Sign in</a>
        </nav>
        <section className={styles.hero}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <h1>Total life tracking to grow into a better person</h1>
            <p>Never lose track of what's important in life. Lifelog helps you to stay on top of everything going on, so you can measure it and improve on it.</p>
            <div className={styles.buttons}>
              <a href="/login?type=trial" className={styles.buttonPrimary}>Get started</a>
              <a href="#details" className={styles.buttonSecondary}>Learn more</a>
            </div>
          </div>
          <img src='/images/hero.png' alt='happy person'/>
        </section>
        <section className={styles.detail} id='details'>
          <div className={styles.description}>
            <h2>Measure anything</h2>
            <p>Health, relationship quality, productivity, and anything else you can put a number on. More ideas:</p>
            <ul>
              <li>Rate your mood every day on a scale from 1 to 10</li>
              <li>Count the amount of desserts you eat every week</li>
              <li>Keep score of your spouse's complaints every month (joking)</li>
              <li>Maintain a streak of days you've resisted temptation 😏</li>
            </ul>
            <a href="/login?type=trial">Try it →</a>
          </div>
          <div className={styles.center}><img src='/images/detail1.png' alt='metric graphic'/></div>
        </section>
        <section className={styles.detail}>
          <div className={styles.description}>
            <h2>One grid to rule them all</h2>
            <p>Visualize all aspects of your life in one place. You'll start seeing patterns of what works and what hurts. All the ways you're crushing it and what areas need improvement. </p>
            <a href="/login?type=trial">Try it →</a>
          </div>
          <div className={styles.center}><img src='/images/detail2.png' alt='dashboard graphic'/></div>
        </section>
        <section className={styles.detail}>
          <div className={styles.description}>
            <h2>Data collection that's too easy</h2>
            <p>Collect dozens of data points faster than you can use the toilet.</p>
            <a href="/login?type=trial">Try it →</a>
          </div>
          <div className={styles.center}><img src='/images/detail3.png' alt='collect data graphic'/></div>
        </section>
        <section className={styles.cta}>
          <h1>Don't let your dreams stay dreams.</h1>
          <a href="/login?type=trial" className={styles.buttonPrimary}>Get started</a>
          <img src='/images/motivation.png' alt='Shia Lebouf' />
        </section>
      </div>
      <div className={styles.decoration}/>
    </div>
  )
}