"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HeroSlider.module.css';

const slides = [
    {
        id: 1,
        title: 'Bienvenue',
        subtitle: 'à la Maison',
        description: 'Découvrez l\'authenticité de la pâtisserie tunisienne traditionnelle',
        image: '/images/hero/hero-1.jpg',
        link: '/collection',
        buttonText: 'Découvrir'
    },
    {
        id: 2,
        title: 'Idées de',
        subtitle: 'Cadeaux',
        description: 'Des coffrets élégants pour toutes les occasions',
        image: '/images/hero/hero-3.png',
        link: '/idees-cadeaux',
        buttonText: 'Voir les coffrets'
    },
    {
        id: 3,
        title: 'Nos Délices',
        subtitle: 'Traditionnels',
        description: 'Un savoir-faire ancestral transmis de génération en génération',
        image: '/images/hero/hero-1.jpg', // Reusing first image for now since quota is out
        link: '/notre-histoire',
        buttonText: 'Notre histoire'
    }
];

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    return (
        <section className={styles.hero}>
            <div className={styles.slider}>
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`${styles.slide} ${index === currentSlide ? styles.slideActive : ''}`}
                    >
                        <div className={styles.slideBackground}>
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                priority={index === 0}
                                className={styles.heroImage}
                            />
                            <div className={styles.overlay} />
                        </div>
                        <div className={styles.slideContent}>
                            <div className={styles.container}>
                                <div className={styles.textContent}>
                                    <h1 className={styles.title}>
                                        <span className={styles.titleMain}>{slide.title}</span>
                                        <span className={styles.titleSub}>{slide.subtitle}</span>
                                    </h1>
                                    <p className={styles.description}>{slide.description}</p>
                                    <Link href={slide.link} className={styles.ctaButton}>
                                        {slide.buttonText}
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                            <polyline points="12 5 19 12 12 19" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button onClick={prevSlide} className={`${styles.navButton} ${styles.navPrev}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            </button>
            <button onClick={nextSlide} className={`${styles.navButton} ${styles.navNext}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>

            {/* Indicators */}
            <div className={styles.indicators}>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`${styles.indicator} ${index === currentSlide ? styles.indicatorActive : ''}`}
                    />
                ))}
            </div>

            {/* Decorative elements */}
            <div className={styles.decorTop} />
            <div className={styles.decorBottom} />
        </section>
    );
}
