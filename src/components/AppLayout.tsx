
import React, { ReactNode, useEffect } from 'react';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { WelcomeTour } from './WelcomeTour';
import { localStorageService } from '@/services/localStorage';
import { Site } from '@/models/site';

interface AppLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function AppLayout({ children, requireAuth = true }: AppLayoutProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const isNewUser = user && !localStorageService.get<boolean>(`tour_shown_${user.id}`);

  useEffect(() => {
    // For new users, we want to ensure they have a clean start
    if (isNewUser) {
      console.log("New user detected, preparing clean environment");
      
      // We don't clear everything as that would log them out
      // Instead we ensure they don't have sample data by checking a flag
      
      const hasInitializedOwnData = localStorageService.get<boolean>(`data_initialized_${user.id}`);
      
      if (!hasInitializedOwnData) {
        // Clear site-related data only for this new user
        const allSites = localStorageService.get<Site[]>('sites') || [];
        const otherUsersSites = allSites.filter(site => site.supervisor_id !== user.id);
        localStorageService.set('sites', otherUsersSites);
        
        // Mark as initialized for this user
        localStorageService.set(`data_initialized_${user.id}`, true);
      }
    }
  }, [isNewUser, user]);

  if (requireAuth && !loading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {isAuthenticated && <AppSidebar />}
        <main className="flex-1 overflow-y-auto">
          <div className="sticky top-0 z-10 flex h-14 items-center border-b border-border bg-background px-4">
            <SidebarTrigger className="mr-4">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </SidebarTrigger>
            <h1 className="text-lg font-semibold">Upastithi</h1>
          </div>
          <div className="container py-6">
            {children}
          </div>
        </main>
        {isNewUser && <WelcomeTour />}
      </div>
    </SidebarProvider>
  );
}
