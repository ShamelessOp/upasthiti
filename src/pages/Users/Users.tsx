
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, UserRole } from "@/models/user";
import { userManagementService } from "@/services/userManagementService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, Plus, RefreshCcw, Users as UsersIcon } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface UserWithEmail {
  id: string;
  name: string;
  role: string;
  email: string;
  created_at: string;
  site_id?: string | null;
}

export default function Users() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    role: 'siteManager' as UserRole,
  });

  const { data: users, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['users'],
    queryFn: userManagementService.getAllUsers,
  });

  const createUserMutation = useMutation({
    mutationFn: userManagementService.createUser,
    onSuccess: () => {
      toast.success("User created successfully");
      setNewUser({ email: '', password: '', name: '', role: 'siteManager' });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    },
    onSettled: () => {
      setIsCreating(false);
    }
  });

  // Check if current user has permission
  useEffect(() => {
    if (user?.role !== 'supervisor' && user?.role !== 'admin') {
      toast.error("You don't have permission to access this page");
      navigate('/');
    }
  }, [user, navigate]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email || !newUser.password || !newUser.name) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsCreating(true);
    createUserMutation.mutate(newUser);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">Manage system users and their roles</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" disabled={isRefetching}>
          <RefreshCcw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
          <CardDescription>Add a new user to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name*</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password*</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role*</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: UserRole) => setNewUser(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="siteManager">Site Manager</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Plus className="mr-2 h-4 w-4" />
              Create User
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            User List
          </CardTitle>
          <CardDescription>All users in the system ({users?.length || 0} users)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    <div className="flex justify-center">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : users && users.length > 0 ? (
                users.map((user: UserWithEmail) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name || "N/A"}</TableCell>
                    <TableCell>{user.email || "N/A"}</TableCell>
                    <TableCell className="capitalize">{user.role || "N/A"}</TableCell>
                    <TableCell>
                      {user.created_at 
                        ? new Date(user.created_at).toLocaleDateString() 
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No users found. Create a user to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
