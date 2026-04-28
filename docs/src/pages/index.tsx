import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './index.module.css';

const features = [
  {
    emoji: '🧹',
    title: 'Clean Code',
    description: 'Remove redundant ARIA attributes and roles that the browser already provides.',
  },
  {
    emoji: '♿',
    title: 'Accessible',
    description: 'Prevent destructive roles and conflicting ARIA that break assistive technologies.',
  },
  {
    emoji: '🔧',
    title: 'Auto-fixable',
    description: 'All six rules provide safe autofixes for static attribute values.',
  },
];

export default function Home(): React.JSX.Element {
  return (
    <Layout
      title="Home"
      description="ESLint plugin that enforces implicit HTML semantics over explicit ARIA attributes and roles"
    >
      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              ESLint Plugin<br />
              <span className={styles.titleAccent}>Prefer Implicit</span>
            </h1>
            <p className={styles.description}>
              Modern HTML already provides rich, implicit semantics. However, many codebases add redundant or even harmful ARIA attributes and roles.
              This plugin enforces a simple principle:
            </p>
            <p className={styles.tagline}>
              If the browser already knows it, don't repeat it.
            </p>
            <div className={styles.buttons}>
              <Link className="button button--primary button--lg" to={useBaseUrl('/getting-started')}>
                Get Started
              </Link>
            </div>
          </div>
          <div className={styles.heroLogo}>
            <img
              src={useBaseUrl('/img/logo.svg')}
              alt="@k9n/eslint-plugin-prefer-implicit logo"
              className={styles.logo}
            />
          </div>
        </section>

        <section className={styles.features}>
          {features.map((f, i) => (
            <article key={i} className={styles.feature}>
              <div className={styles.featureEmoji}>{f.emoji}</div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </article>
          ))}
        </section>

        <section className={styles.demoSection}>
          <div className={styles.demoInner}>
            <h2 className={styles.demoTitle}>See it in action</h2>
            <p className={styles.demoSubtitle}>
              Watch the plugin detect and fix real a11y violations — step by step.
            </p>
            <BrowserOnly fallback={<div className={styles.demoFallback}>Loading demo…</div>}>
              {() => {
                const A11yDemo = require('../components/A11yDemo').default;
                return <A11yDemo />;
              }}
            </BrowserOnly>
          </div>
        </section>
      </main>
    </Layout>
  );
}
