/**
 * Server component wrapper for admin layout
 * Authentication is handled by the client-side AdminContext
 * This replaces the middleware functionality for page routes
 */
export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
