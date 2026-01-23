"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { CustomerSafe } from '@/lib/types/customer';

export default function AccountPage() {
    const [customer, setCustomer] = useState<CustomerSafe | null>(null);
    const [loginData, setLoginData] = useState({ identifier: '', password: '' });
    const [registerData, setRegisterData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setCustomer(data.data);
                }
            }
        } catch (err) {
            console.error('Auth check failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });
            const data = await res.json();
            if (data.success) {
                setCustomer(data.data);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Erreur de connexion');
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData)
            });
            const data = await res.json();
            if (data.success) {
                setCustomer(data.data);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Erreur lors de l\'inscription');
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setCustomer(null);
    };

    if (isLoading) return (
        <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Vérification du compte...</p>
        </div>
    );

    if (customer) {
        return (
            <main className={styles.page}>
                <div className={styles.container}>
                    <h1 className={styles.mainTitle}>Bienvenue, {customer.firstName || customer.username}</h1>
                    <div className={styles.formBox} style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                        <p style={{ marginBottom: '20px' }}>Vous êtes connecté en tant que <strong>{customer.email}</strong></p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '30px', textAlign: 'left' }}>
                            <div>
                                <small style={{ color: '#666' }}>Nom d'utilisateur</small>
                                <p>{customer.username}</p>
                            </div>
                            <div>
                                <small style={{ color: '#666' }}>Membre depuis</small>
                                <p>{new Date(customer.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className={styles.submitButton} style={{ background: '#666' }}>
                            Déconnexion
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.mainTitle}>Mon compte</h1>

                {error && (
                    <div style={{ padding: '15px', background: '#FDE8E8', color: '#9B1C1C', borderRadius: '8px', marginBottom: '30px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <div className={styles.accountGrid}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Se connecter</h2>
                        <div className={styles.formBox}>
                            <form onSubmit={handleLogin}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        Identifiant ou e-mail <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={loginData.identifier}
                                        onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        Mot de passe <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        type="password"
                                        className={styles.input}
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className={styles.verificationBlock}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '24px', height: '24px', border: '3px solid #10B981', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                        <span style={{ fontSize: '14px', color: '#666' }}>Vérification...</span>
                                    </div>
                                    <div className={styles.cfContainer}>
                                        <div className={styles.cfLogo}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#F48120">
                                                <path d="M21.5 12.002c0 .647-.078 1.274-.225 1.874l-2.454-1.127a.75.75 0 0 0-1.018.675v3.476L11.5 20.3l-6.303-3.4v-3.476a.75.75 0 0 0-1.018-.675l-2.454 1.127A9.457 9.457 0 0 1 1.5 12c0-5.247 4.253-9.5 9.5-9.5s9.5 4.253 9.5 9.5z" />
                                            </svg>
                                            CLOUDFLARE
                                        </div>
                                        <div className={styles.cfLinks}>Confidentialité • Conditions</div>
                                    </div>
                                </div>

                                <label className={styles.rememberMe}>
                                    <input type="checkbox" /> Se souvenir de moi
                                </label>

                                <button type="submit" className={styles.submitButton}>
                                    Se connecter
                                </button>

                                <Link href="#" className={styles.lostPassword}>
                                    Mot de passe perdu ?
                                </Link>
                            </form>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>S'inscrire</h2>
                        <div className={styles.formBox}>
                            <form onSubmit={handleRegister}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        Adresse e-mail <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className={styles.input}
                                        value={registerData.email}
                                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        Mot de passe <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        type="password"
                                        className={styles.input}
                                        value={registerData.password}
                                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                        required
                                    />
                                </div>

                                <p className={styles.helperText}>
                                    Un lien permettant de définir un nouveau mot de passe sera envoyé à votre adresse e-mail.
                                </p>

                                <div className={styles.successBlock}>
                                    <div className={styles.successIcon}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                    <span className={styles.successText}>Succès !</span>
                                    <div className={styles.cfContainer} style={{ marginLeft: 'auto' }}>
                                        <div className={styles.cfLogo}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#F48120">
                                                <path d="M21.5 12.002c0 .647-.078 1.274-.225 1.874l-2.454-1.127a.75.75 0 0 0-1.018.675v3.476L11.5 20.3l-6.303-3.4v-3.476a.75.75 0 0 0-1.018-.675l-2.454 1.127A9.457 9.457 0 0 1 1.5 12c0-5.247 4.253-9.5 9.5-9.5s9.5 4.253 9.5 9.5z" />
                                            </svg>
                                            CLOUDFLARE
                                        </div>
                                        <div className={styles.cfLinks}>Confidentialité • Conditions</div>
                                    </div>
                                </div>

                                <p className={styles.policyText}>
                                    Vos données personnelles seront utilisées pour soutenir votre expérience sur ce site Web, pour gérer l'accès à votre compte et à d'autres fins décrites dans notre <Link href="#" className={styles.policyLink}>politique de confidentialité</Link>.
                                </p>

                                <button type="submit" className={styles.submitButton}>
                                    S'inscrire
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            </div>

            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </main>
    );
}
