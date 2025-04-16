
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { WorkerFilter } from '@/models/worker';
import { workerService } from '@/services/workerService';
import NewWorkerDialog from './components/NewWorkerDialog';
import { Badge } from '@/components/ui/badge';

export default function Workers() {
  const { siteId } = useParams<{ siteId: string }>();
  const [showNewWorkerDialog, setShowNewWorkerDialog] = useState(false);
  const [filters, setFilters] = useState<WorkerFilter>({ 
    siteId: siteId,
    searchQuery: '',
    status: undefined,
  });

  const { data: workers, isLoading, refetch } = useQuery({
    queryKey: ['workers', siteId, filters],
    queryFn: () => workerService.getWorkers(filters),
    enabled: !!siteId,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({...filters, searchQuery: e.target.value});
  };

  if (!siteId) return <div>Site ID not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Workers</h2>
          <p className="text-muted-foreground">Manage workers for this site</p>
        </div>
        <Button onClick={() => setShowNewWorkerDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Worker
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workers by name or ID..."
            className="pl-8"
            value={filters.searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filters.status === 'active' ? 'default' : 'outline'}
            onClick={() => setFilters({...filters, status: filters.status === 'active' ? undefined : 'active'})}
            size="sm"
          >
            Active
          </Button>
          <Button
            variant={filters.status === 'inactive' ? 'default' : 'outline'}
            onClick={() => setFilters({...filters, status: filters.status === 'inactive' ? undefined : 'inactive'})}
            size="sm"
          >
            Inactive
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-[200px] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workers?.map(worker => (
            <Card key={worker.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <User className="h-4 w-4" />
                    {worker.name}
                  </CardTitle>
                  <Badge variant={worker.status === 'active' ? 'default' : 'secondary'}>
                    {worker.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">ID:</dt>
                    <dd>{worker.worker_id}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Contact:</dt>
                    <dd>{worker.contact_number}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Daily Wage:</dt>
                    <dd>₹{worker.daily_wage}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Joined:</dt>
                    <dd>{new Date(worker.joining_date).toLocaleDateString()}</dd>
                  </div>
                  {worker.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {worker.skills.map(skill => (
                        <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          ))}
          {workers?.length === 0 && (
            <div className="col-span-full flex h-[200px] items-center justify-center">
              <p className="text-muted-foreground">No workers found. Add your first worker!</p>
            </div>
          )}
        </div>
      )}

      <NewWorkerDialog 
        open={showNewWorkerDialog} 
        onOpenChange={setShowNewWorkerDialog}
        siteId={siteId}
        onSuccess={refetch}
      />
    </div>
  );
}
