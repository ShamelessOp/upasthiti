
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAppInitialization() {
  useEffect(() => {
    const initializeApp = async () => {
      console.log('Initializing app with real-time Supabase functionality...');
      
      try {
        // Check Supabase connection
        const { data, error } = await supabase.from('sites').select('count', { count: 'exact', head: true });
        
        if (error) {
          console.error('Supabase connection error:', error);
        } else {
          console.log('Supabase connected successfully');
        }
        
        // Set up Supabase auth state change listener for logging
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          console.log('Auth state change:', event, session ? session.user?.email : 'No user');
        });
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error during app initialization:', error);
      }
    };
    
    initializeApp();
  }, []);
}
