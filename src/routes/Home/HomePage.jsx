import React from 'react';
import styles from './HomePage.module.css';

export default function Home() {
    return (
        <div className={styles.homeContainer}>
            {/* Заголовок и описание */}
            <div className={styles.homeHero}>
                <h1 className={styles.homeTitle}>
                    Добро пожаловать в Triceratops!
                </h1>

                <p className={styles.homeDescription}>
                    Инновационная платформа для получения качественного образования.
                    Мы помогаем студентам и профессионалам развивать навыки,
                    необходимые для успешной карьеры в цифровую эпоху.
                </p>
            </div>

            {/* Преимущества */}
            <div className={styles.featuresGrid}>
                {/* Карточка 1 */}
                <div className={styles.featureCard}>
                    <div className={styles.featureIcon}>📚</div>
                    <h3 className={styles.featureTitle}>Разнообразные курсы</h3>
                    <p className={styles.featureDescription}>
                        Широкий выбор образовательных программ по различным
                        направлениям и уровням сложности.
                    </p>
                </div>

                {/* Карточка 2 */}
                <div className={styles.featureCard}>
                    <div className={styles.featureIcon}>⚡</div>
                    <h3 className={styles.featureTitle}>Современные технологии</h3>
                    <p className={styles.featureDescription}>
                        Обучение с использованием передовых технологий
                        и интерактивных методик.
                    </p>
                </div>

                {/* Карточка 3 */}
                <div className={styles.featureCard}>
                    <div className={styles.featureIcon}>🎯</div>
                    <h3 className={styles.featureTitle}>Практическая направленность</h3>
                    <p className={styles.featureDescription}>
                        Фокус на реальных проектах и задачах, которые
                        помогут в профессиональном развитии.
                    </p>
                </div>
            </div>

            {/* Призыв к действию */}
            <div className={styles.ctaSection}>
                <h2 className={styles.ctaTitle}>Готовы начать обучение?</h2>
                <p className={styles.ctaDescription}>
                    Присоединяйтесь к тысячам студентов, которые уже
                    начали свой путь к успеху с Triceratops!
                </p>
                <button className={styles.ctaButton}>
                    Начать сейчас
                </button>
            </div>
        </div>
    );
}