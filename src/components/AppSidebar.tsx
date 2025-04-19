
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Building,
  Calendar,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  DollarSign,
  LogOut,
  Package,
  Settings,
  User,
  Users,
  Droplet,
} from "lucide-react";

export function AppSidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  
  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="flex h-14 items-center border-b border-border px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-xl text-sidebar-foreground">Upastithi</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <SidebarTrigger>
            <ChevronsLeft className="h-4 w-4 sidebar-expanded:hidden" />
            <ChevronsRight className="h-4 w-4 hidden sidebar-expanded:block" />
            <span className="sr-only">Toggle Sidebar</span>
          </SidebarTrigger>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/sites")}>
                <Link to="/sites">
                  <Building className="h-4 w-4" />
                  <span>Sites</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/attendance")}>
                <Link to="/attendance">
                  <Calendar className="h-4 w-4" />
                  <span>Attendance</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/payroll")}>
                <Link to="/payroll">
                  <DollarSign className="h-4 w-4" />
                  <span>Payroll</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/inventory")}>
                <Link to="/inventory">
                  <Package className="h-4 w-4" />
                  <span>Inventory</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/iot-controls")}>
                <Link to="/iot-controls">
                  <Droplet className="h-4 w-4" />
                  <span>IoT Controls</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/cashbook")}>
                <Link to="/cashbook">
                  <ClipboardList className="h-4 w-4" />
                  <span>Cashbook</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {(user?.role === "admin" || user?.role === "supervisor") && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/reports")}>
                  <Link to="/reports">
                    <ClipboardList className="h-4 w-4" />
                    <span>Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>
        
        {user?.role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/users")}>
                  <Link to="/users">
                    <Users className="h-4 w-4" />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/settings")}>
                  <Link to="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        {user && (
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
              <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col text-sm">
              <span>{user.name}</span>
              <span className="text-xs text-sidebar-foreground/60">{user.email}</span>
            </div>
            <button
              className="ml-auto rounded-full p-2 text-sidebar-foreground/60 hover:text-sidebar-foreground"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Log out</span>
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
