"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { Employee } from '@/lib/types/employee';

export default function AdminEmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('/api/admin/employees');
            const data = await response.json();
            if (data.success) {
                setEmployees(data.data);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Voulez-vous vraiment supprimer l'employé "${name}" ?`)) return;

        try {
            const response = await fetch(`/api/admin/employees/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                setEmployees(employees.filter(e => e.id !== id));
            } else {
                alert(data.error || 'Erreur lors de la suppression');
            }
        } catch {
            alert('Erreur lors de la suppression');
        }
    };

    const filteredEmployees = employees.filter(e =>
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        e.cin.includes(search) ||
        e.position.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <input
                        type="text"
                        placeholder="Rechercher un employé (nom, cin, poste)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <Link href="/admin/employees/new" className={styles.addButton}>
                    + Ajouter un employé
                </Link>
            </div>

            {isLoading ? (
                <div className={styles.loading}>Chargement...</div>
            ) : filteredEmployees.length === 0 ? (
                <div className={styles.empty}>
                    <p>Aucun employé trouvé</p>
                    <Link href="/admin/employees/new" className={styles.emptyButton}>
                        Ajouter votre premier employé
                    </Link>
                </div>
            ) : (
                <div className={styles.table}>
                    <div className={styles.tableHeader}>
                        <span>Employé</span>
                        <span>CIN</span>
                        <span>Poste</span>
                        <span>Contact</span>
                        <span>Rémunération</span>
                        <span>Statut</span>
                        <span>Actions</span>
                    </div>
                    {filteredEmployees.map((employee) => (
                        <div key={employee.id} className={styles.tableRow}>
                            <div className={styles.employeeInfo}>
                                <div className={styles.avatar}>
                                    {employee.firstName[0]}{employee.lastName[0]}
                                </div>
                                <div>
                                    <div className={styles.employeeName}>
                                        {employee.firstName} {employee.lastName}
                                    </div>
                                    <div className={styles.hireDate}>
                                        Recruté le {new Date(employee.hireDate).toLocaleDateString('fr-FR')}
                                    </div>
                                </div>
                            </div>
                            <span className={styles.cin}>{employee.cin}</span>
                            <span className={styles.position}>{employee.position}</span>
                            <div className={styles.contact}>
                                <div className={styles.phone}>{employee.phone}</div>
                                <div className={styles.address}>{employee.address}</div>
                            </div>
                            <span className={styles.amount}>{employee.amount.toFixed(2)} TND</span>
                            <div>
                                {employee.isActive ? (
                                    <span className={styles.badgeActive}>Actif</span>
                                ) : (
                                    <span className={styles.badgeInactive}>Inactif</span>
                                )}
                            </div>
                            <div className={styles.actions}>
                                <Link href={`/admin/employees/${employee.id}`} className={styles.editButton}>
                                    Modifier
                                </Link>
                                <button
                                    onClick={() => handleDelete(employee.id, `${employee.firstName} ${employee.lastName}`)}
                                    className={styles.deleteButton}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
