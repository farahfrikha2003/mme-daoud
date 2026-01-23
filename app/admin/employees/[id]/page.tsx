"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { Employee, CreateEmployeeInput } from '@/lib/types/employee';

const emptyEmployee: CreateEmployeeInput & { isActive: boolean } = {
    lastName: '',
    firstName: '',
    cin: '',
    phone: '',
    address: '',
    position: '',
    amount: 0,
    hireDate: new Date().toISOString().split('T')[0],
    isActive: true
};

export default function EmployeeEditPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const isNew = id === 'new';

    const [employee, setEmployee] = useState(emptyEmployee);
    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isNew) {
            fetchEmployee();
        }
    }, [id, isNew]);

    const fetchEmployee = async () => {
        try {
            const response = await fetch(`/api/admin/employees/${id}`);
            const data = await response.json();
            if (data.success) {
                setEmployee(data.data);
            } else {
                setError(data.error || 'Employé non trouvé');
            }
        } catch {
            setError('Erreur lors du chargement de l\'employé');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setEmployee(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            const val = value === '' ? 0 : parseFloat(value);
            setEmployee(prev => ({ ...prev, [name]: val }));
        } else {
            setEmployee(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);

        try {
            const url = isNew ? '/api/admin/employees' : `/api/admin/employees/${id}`;
            const method = isNew ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employee)
            });

            const data = await response.json();

            if (data.success) {
                router.push('/admin/employees');
                router.refresh();
            } else {
                setError(data.error || 'Erreur lors de la sauvegarde');
            }
        } catch {
            setError('Erreur de connexion');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Chargement...</div>;
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    {isNew ? 'Nouvel Employé' : `Modifier ${employee.firstName} ${employee.lastName}`}
                </h1>
                <div className={styles.actions}>
                    <Link href="/admin/employees" className={styles.cancelButton}>
                        Annuler
                    </Link>
                    <button
                        className={styles.saveButton}
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </div>

            {error && <div className={styles.errorBanner}>{error}</div>}

            <div className={styles.formContainer}>
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Informations Personnelles</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Nom</label>
                            <input
                                type="text"
                                name="lastName"
                                value={employee.lastName}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Nom de famille"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Prénom</label>
                            <input
                                type="text"
                                name="firstName"
                                value={employee.firstName}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Prénom"
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>CIN</label>
                            <input
                                type="text"
                                name="cin"
                                value={employee.cin}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Numéro de la carte d'identité"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Téléphone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={employee.phone}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Ex: 22 123 456"
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Adresse</label>
                        <textarea
                            name="address"
                            value={employee.address}
                            onChange={handleChange}
                            className={styles.textarea}
                            placeholder="Adresse complète"
                        />
                    </div>
                </div>

                <div className={styles.sideColumn}>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Détails du Poste</h2>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Poste / Fonction</label>
                            <input
                                type="text"
                                name="position"
                                value={employee.position}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Ex: Chef Pâtissier"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Date d'embauche</label>
                            <input
                                type="date"
                                name="hireDate"
                                value={employee.hireDate}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Rémunération (Montant)</label>
                            <div className={styles.inputWithUnit}>
                                <input
                                    type="number"
                                    name="amount"
                                    value={employee.amount}
                                    onChange={handleChange}
                                    className={styles.input}
                                    min="0"
                                    step="0.01"
                                />
                                <span className={styles.unit}>TND</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Statut</h2>
                        <label className={styles.toggleItem}>
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={employee.isActive}
                                onChange={handleChange}
                                className={styles.checkbox}
                            />
                            <div className={styles.toggleText}>
                                <span>Actif</span>
                                <small>L'employé fait partie de l'équipe</small>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
