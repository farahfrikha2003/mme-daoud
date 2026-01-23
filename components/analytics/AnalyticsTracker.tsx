"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Ne pas tracker les pages admin ou les routes API
        if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) {
            return;
        }

        const trackVisit = async () => {
            try {
                const response = await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ path: pathname }),
                });

                // Ne pas logger les erreurs en production pour éviter le bruit
                if (!response.ok && process.env.NODE_ENV === 'development') {
                    console.warn('Analytics tracking failed:', response.status);
                }
            } catch (error) {
                // Ignorer les erreurs de réseau silencieusement en production
                if (process.env.NODE_ENV === 'development') {
                    console.error('Analytics error:', error);
                }
            }
        };

        // Délai pour éviter de tracker les navigations rapides
        const timeoutId = setTimeout(trackVisit, 100);

        return () => clearTimeout(timeoutId);
    }, [pathname]);

    return null;
}
