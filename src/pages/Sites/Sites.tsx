
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { siteService } from "@/services/siteService";
import { Loader2, Plus, Building } from "lucide-react";
import { toast } from "sonner";

export default function Sites() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [newSite, setNewSite] = useState({
    name: '',
    location: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    status: 'active' as const,
  });

  const { data: sites, isLoading, refetch } = useQuery({
    queryKey: ['sites'],
    queryFn: siteService.getAllSites,
  });

  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await siteService.createSite(newSite);
      setNewSite({
        name: '',
        location: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        status: 'active',
      });
      refetch();
    } finally {
      setIsCreating(false);
    }
  };

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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Site</CardTitle>
          <CardDescription>Add a new construction site</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateSite} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Site Name</Label>
                <Input
                  id="name"
                  value={newSite.name}
                  onChange={(e) => setNewSite(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newSite.location}
                  onChange={(e) => setNewSite(prev => ({ ...prev, location: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newSite.description}
                  onChange={(e) => setNewSite(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newSite.startDate}
                  onChange={(e) => setNewSite(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Plus className="mr-2 h-4 w-4" />
              Create Site
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sites?.map((site) => (
          <Card key={site.id} className="cursor-pointer hover:bg-accent/50" onClick={() => navigate(`/sites/${site.id}`)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {site.name}
              </CardTitle>
              <CardDescription>{site.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="capitalize">{site.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date:</span>
                  <span>{new Date(site.start_date).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
