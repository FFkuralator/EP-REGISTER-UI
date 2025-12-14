import React from 'react';
import styles from './AboutPage.module.css';

export default function About() {
    return (
        <div className={styles.aboutContainer}>
            {/* Заголовок страницы */}
            <div className={styles.aboutHeader}>
                <h1 className={styles.aboutTitle}>Lorem Ipsum</h1>
                <p className={styles.aboutSubtitle}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tincidunt auctor finibus.
                </p>
            </div>

            {/* Основной контент */}
            <div className={styles.aboutContent}>
                <section className={`${styles.aboutSection} ${styles.missionSection}`}>
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>Lorem ipsum</span></h2>
                    <p className={styles.sectionDescription}>
                        Integer imperdiet urna nisi. Mauris congue libero quis tincidunt vestibulum. Praesent posuere sem vel nisi sollicitudin pellentesque. Proin non molestie eros. Mauris iaculis efficitur eros vel condimentum.
                    </p>
                </section>
            </div>
        </div>
    );
}