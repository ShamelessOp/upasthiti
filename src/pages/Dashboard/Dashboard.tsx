
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calendar, Users, DollarSign, Package, ClipboardList, ArrowRight } from "lucide-react";
import { siteService } from "@/services/siteService";
import { workerService } from "@/services/workerService";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { siteId } = useParams<{ siteId: string }>();

  const { data: site, isLoading: isLoadingSite } = useQuery({
    queryKey: ["site", siteId],
    queryFn: () => siteService.getSiteById(siteId!),
    enabled: !!siteId,
  });

  const { data: workers, isLoading: isLoadingWorkers } = useQuery({
    queryKey: ["workers", siteId],
    queryFn: () => workerService.getWorkers({ siteId }),
    enabled: !!siteId,
  });

  if (!siteId) return <div>Site ID not found</div>;

  if (isLoadingSite || isLoadingWorkers) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!site) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center">
        <p className="mb-4">Site not found</p>
        <Button asChild>
          <Link to="/sites">Back to Sites</Link>
        </Button>
      </div>
    );
  }

  const activeWorkers = workers?.filter(w => w.status === 'active').length || 0;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{site.name}</h2>
            <p className="text-muted-foreground">{site.location}</p>
          </div>
          <Badge className={`
            ${site.status === 'active' ? 'bg-green-100 text-green-700' : 
              site.status === 'paused' ? 'bg-yellow-100 text-yellow-700' : 
              'bg-gray-100 text-gray-700'}
          `}>
            {site.status}
          </Badge>
        </div>
        <div className="mt-2">
          {site.description && <p>{site.description}</p>}
          <div className="flex gap-4 mt-2">
            <p className="text-sm text-muted-foreground">
              Start Date: {new Date(site.start_date).toLocaleDateString()}
            </p>
            {site.end_date && (
              <p className="text-sm text-muted-foreground">
                End Date: {new Date(site.end_date).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workers?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {activeWorkers} active workers
            </p>
            <Button asChild variant="ghost" size="sm" className="mt-2 w-full">
              <Link to={`/sites/${siteId}/workers`}>
                Manage Workers
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Manage daily attendance
            </p>
            <Button asChild variant="ghost" size="sm" className="mt-2 w-full">
              <Link to={`/sites/${siteId}/attendance`}>
                Take Attendance
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Manage worker payments
            </p>
            <Button asChild variant="ghost" size="sm" className="mt-2 w-full">
              <Link to={`/sites/${siteId}/payroll`}>
                Process Payroll
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              View site analytics
            </p>
            <Button asChild variant="ghost" size="sm" className="mt-2 w-full">
              <Link to={`/sites/${siteId}/reports`}>
                View Reports
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
