
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Building, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { siteService } from '@/services/siteService';
import { Site } from '@/models/site';
import NewSiteDialog from './components/NewSiteDialog';
import { useRealtimeData } from '@/hooks/useRealtimeData';

export default function Sites() {
  const navigate = useNavigate();
  const [showNewSiteDialog, setShowNewSiteDialog] = React.useState(false);
  
  const { data: sites, isLoading, refetch } = useQuery({
    queryKey: ['sites'],
    queryFn: siteService.getAllSites,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Set up realtime data subscription
  useRealtimeData('sites', 'sites');

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sites</h2>
          <p className="text-muted-foreground">Manage your construction sites</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowNewSiteDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Site
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sites?.map((site: Site) => (
          <Card key={site.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/sites/${site.id}`)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {site.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{site.location}</p>
              <p className="text-sm text-muted-foreground">{site.description}</p>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-center justify-between">
                <span className="text-sm font-medium">
                  Started: {new Date(site.start_date).toLocaleDateString()}
                </span>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  site.status === 'active' ? 'bg-green-100 text-green-700' :
                  site.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {site.status}
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <NewSiteDialog open={showNewSiteDialog} onOpenChange={setShowNewSiteDialog} />
    </div>
  );
}
