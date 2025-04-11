
import React, { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface AppLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function AppLayout({ children, requireAuth = true }: AppLayoutProps) {
  const { isAuthenticated, loading } = useAuth();

  // If authentication is required but user is not authenticated,
  // redirect to the login page
  if (requireAuth && !loading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If we're still loading, show a loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // If no authentication is required or user is authenticated, show the layout
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {isAuthenticated && <AppSidebar />}
        <main className="flex-1 overflow-y-auto">
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
