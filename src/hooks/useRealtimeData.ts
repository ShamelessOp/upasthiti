
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type TableName = 'sites' | 'workers' | 'attendance' | 'profiles';
type ChangeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

// Define the payload type for postgres_changes events
type PostgresChangesPayload = {
  new: Record<string, any> | null;
  old: Record<string, any> | null;
  errors: any;
};

export function useRealtimeData(
  tableName: TableName, 
  queryKey: string | string[], 
  events: ChangeEvent[] = ['*']
) {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // Set up realtime subscriptions
    const setupRealtimeSubscription = async () => {
      // Create the channel for this table
      const channel = supabase.channel(`${tableName}-changes`);
      
      // Set up subscription for each event type
      events.forEach(event => {
        if (event === '*') {
          // Subscribe to all events
          const specificEvents: ('INSERT' | 'UPDATE' | 'DELETE')[] = ['INSERT', 'UPDATE', 'DELETE'];
          specificEvents.forEach(specificEvent => {
            channel.on(
              'postgres_changes' as any,
              {
                event: specificEvent,
                schema: 'public',
                table: tableName,
              },
              (payload: PostgresChangesPayload) => {
                console.log(`${specificEvent} event on ${tableName}:`, payload);
                queryClient.invalidateQueries({ queryKey: Array.isArray(queryKey) ? queryKey : [queryKey] });
                
                // Show toast notification
                const record = payload.new || payload.old;
                if (record) {
                  const recordName = record.name || record.id;
                  
                  if (specificEvent === 'INSERT') {
                    toast.success(`New ${tableName.slice(0, -1)} added: ${recordName}`);
                  } else if (specificEvent === 'UPDATE') {
                    toast.info(`${tableName.slice(0, -1)} updated: ${recordName}`);
                  } else if (specificEvent === 'DELETE') {
                    toast.info(`${tableName.slice(0, -1)} removed: ${recordName}`);
                  }
                }
              }
            );
          });
        } else {
          // Subscribe to specific event
          channel.on(
            'postgres_changes' as any,
            {
              event: event,
              schema: 'public',
              table: tableName,
            },
            (payload: PostgresChangesPayload) => {
              console.log(`${event} event on ${tableName}:`, payload);
              queryClient.invalidateQueries({ queryKey: Array.isArray(queryKey) ? queryKey : [queryKey] });
              
              // Show toast notification for specific event
              const record = payload.new || payload.old;
              if (record) {
                const recordName = record.name || record.id;
                
                if (event === 'INSERT') {
                  toast.success(`New ${tableName.slice(0, -1)} added: ${recordName}`);
                } else if (event === 'UPDATE') {
                  toast.info(`${tableName.slice(0, -1)} updated: ${recordName}`);
                } else if (event === 'DELETE') {
                  toast.info(`${tableName.slice(0, -1)} removed: ${recordName}`);
                }
              }
            }
          );
        }
      });
      
      // Subscribe to the channel
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Realtime subscription active for ${tableName}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Failed to subscribe to realtime updates for ${tableName}`);
        }
      });
      
      // Return unsubscribe function
      return () => {
        supabase.removeChannel(channel);
      };
    };
    
    const unsubscribe = setupRealtimeSubscription();
    
    // Cleanup subscription on unmount
    return () => {
      unsubscribe.then(unsub => {
        if (typeof unsub === 'function') {
          unsub();
        }
      });
    };
  }, [tableName, Array.isArray(queryKey) ? queryKey.join(',') : queryKey, queryClient, events.join(',')]);
}

// Helper function to enable realtime for multiple tables
export async function enableRealtimeForTables(tableNames: TableName[]) {
  for (const tableName of tableNames) {
    try {
      await supabase.rpc('enable_realtime', { table_name: tableName });
      console.log(`Enabled realtime for ${tableName}`);
    } catch (error) {
      console.log(`Realtime might already be enabled for ${tableName} or not available`);
    }
  }
}
