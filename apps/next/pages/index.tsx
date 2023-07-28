import Link from 'next/link'
import styles from '../styles/landing.module.css'

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <nav className={styles.nav}>
          <span className={styles.logoType}>Lifelog</span>
          <Link href="/login?type=login" className={styles.buttonSecondary}>Sign in</Link>
        </nav>
        <section className={styles.hero}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <h1>Total life tracking to grow into a better person</h1>
            <p>Never lose track of what&rsquo;s important in life. Lifelog helps you to stay on top of everything going on, so you can measure it and improve on it.</p>
            <div className={styles.buttons}>
              <Link href="/login?type=trial" className={styles.buttonPrimary}>Get started</Link>
              <Link href="#details" className={styles.buttonSecondary}>Learn more</Link>
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
              <li>Keep score of your spouse&rsquo;s complaints every month (joking 🤪)</li>
              <li>Maintain a streak of days you&rsquo;ve resisted temptation 😏</li>
            </ul>
            <Link href="/login?type=trial">Try it →</Link>
          </div>
          <div className={styles.center}><img src='/images/detail1.png' alt='metric graphic'/></div>
        </section>
        <section className={styles.detail}>
          <div className={styles.description}>
            <h2>One grid to rule them all</h2>
            <p>Visualize all aspects of your life in one place. You&rsquo;ll start seeing patterns of what works and what hurts. All the ways you&rsquo;re crushing it and what areas need improvement. </p>
            <Link href="/login?type=trial">Try it →</Link>
          </div>
          <div className={styles.center}><img src='/images/detail2.png' alt='dashboard graphic'/></div>
        </section>
        <section className={styles.detail}>
          <div className={styles.description}>
            <h2>Data collection that&rsquo;s too easy</h2>
            <p>Collect dozens of data points faster than you can use the toilet.</p>
            <Link href="/login?type=trial">Try it →</Link>
          </div>
          <div className={styles.center}><img src='/images/detail3.png' alt='collect data graphic'/></div>
        </section>
        <section className={styles.cta}>
          <h1>Don&rsquo;t let your dreams stay dreams.</h1>
          <Link href="/login?type=trial" className={styles.buttonPrimary}>Get started</Link>
          <img src='/images/motivation.png' alt='Shia Lebouf' />
        </section>
      </div>
      <div className={styles.decoration}/>
    </div>
  )
}