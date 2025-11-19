import React from 'react';
import styles from './AboutPage.module.css';

export default function About() {
    return (
        <div className={styles.aboutContainer}>
            {/* Заголовок страницы */}
            <div className={styles.aboutHeader}>
                <h1 className={styles.aboutTitle}>О компании Triceratops</h1>
                <p className={styles.aboutSubtitle}>
                    Мы - инновационная образовательная платформа,
                    созданная для преобразования подхода к обучению
                    в цифровую эпоху.
                </p>
            </div>

            {/* Основной контент */}
            <div className={styles.aboutContent}>
                <section className={`${styles.aboutSection} ${styles.missionSection}`}>
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>Наша миссия </span></h2>
                    <p className={styles.sectionDescription}>
                        Сделать качественное образование доступным для каждого,
                        независимо от географического положения, возраста или
                        предыдущего опыта. Мы стремимся создать среду, где
                        каждый может раскрыть свой потенциал и приобрести
                        навыки, необходимые для успеха в современном мире.
                    </p>
                </section>
            </div>
        </div>
    );
}