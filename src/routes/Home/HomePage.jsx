import React from 'react';
import styles from './HomePage.module.css';

export default function HomePage() {
    return (
        <div className={styles.homeContainer}>
            {/* Заголовок и описание */}
            <div className={styles.homeHero}>
                <h1 className={styles.homeTitle}>
                    Lorem ipsum dolor sit amet
                </h1>

                <p className={styles.homeDescription}>
                    Integer vitae diam pretium, tincidunt elit auctor, blandit risus. Vivamus hendrerit purus eu congue auctor. Vestibulum iaculis dictum libero tincidunt congue. Donec id viverra nisi. Cras in fermentum lorem, eu efficitur risus. Morbi lacinia, nisl quis aliquam maximus, lacus quam pellentesque magna, at pharetra libero odio vel nunc.   
                </p>
            </div>

            {/* Преимущества */}
            <div className={styles.featuresGrid}>
                {/* Карточка 1 */}
                <div className={styles.featureCard}>
                    <div className={styles.featureIcon}>📚</div>
                    <h3 className={styles.featureTitle}>Lorem ipsum dolor</h3>
                    <p className={styles.featureDescription}>
                        Praesent posuere sem vel nisi sollicitudin pellentesque. Proin non molestie eros.
                    </p>
                </div>

                {/* Карточка 2 */}
                <div className={styles.featureCard}>
                    <div className={styles.featureIcon}>⚡</div>
                    <h3 className={styles.featureTitle}>Lorem ipsum</h3>
                    <p className={styles.featureDescription}>
                        Praesent posuere sem vel nisi sollicitudin pellentesque. Proin non molestie eros.
                    </p>
                </div>

                {/* Карточка 3 */}
                <div className={styles.featureCard}>
                    <div className={styles.featureIcon}>🎯</div>
                    <h3 className={styles.featureTitle}>Lorem ipsum</h3>
                    <p className={styles.featureDescription}>
                        ФPraesent posuere sem vel nisi sollicitudin pellentesque. Proin non molestie eros.
                    </p>
                </div>
            </div>

            {/* Призыв к действию */}
            <div className={styles.ctaSection}>
                <h2 className={styles.ctaTitle}>Lorem ipsum</h2>
                <p className={styles.ctaDescription}>
                    Praesent posuere sem vel nisi sollicitudin pellentesque. Proin non molestie eros.
                </p>
                <button className={styles.ctaButton}>
                    Lorem ipsum
                </button>
            </div>
        </div>
    );
}
