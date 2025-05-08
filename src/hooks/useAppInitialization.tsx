
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { enableRealtimeForTables } from './useRealtimeData';

export function useAppInitialization() {
  useEffect(() => {
    const initializeApp = async () => {
      console.log('Initializing app and preparing real-time functionality...');
      
      try {
        // Enable real-time functionality for key tables
        await enableRealtimeForTables(['sites', 'workers', 'attendance', 'profiles']);
        console.log('Real-time functionality enabled for key tables');
      } catch (error) {
        console.error('Error setting up real-time functionality:', error);
      }
      
      // Set up Supabase auth state change listener for logging
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state change:', event, session ? session.user?.email : 'No user');
      });
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeApp();
  }, []);
}
