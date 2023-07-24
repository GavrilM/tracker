import styles from '../styles/landing.module.css'

export default function() {
  return (
    <div className={styles.hero}>
      <h1>The most flexible tracking tool to grow into a better person</h1>
      <a href="/login?type=trial" className={styles.buttonPrimary}>Try it out</a>
      <a href="/login?type=login" className={styles.buttonSecondary}>Sign in</a>
    </div>
  )
}