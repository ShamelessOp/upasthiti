
import { 
  Sidebar, 
  SidebarFooter, 
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, Settings, Users, Building2, ClipboardList, DollarSign, PackageOpen, LineChart, Wifi } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Sidebar>
      <div className="flex h-14 items-center border-b px-4">
        <div className="font-semibold">
          <span className="inline-block font-bold">Upastithi</span>
          <span className="inline-block ml-1 rounded bg-primary px-1.5 py-0.5 text-xs font-medium text-white">
            App
          </span>
        </div>
      </div>
      <SidebarContent className="my-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/sites" || location.pathname.startsWith("/sites/")}
              asChild
            >
              <a href="/sites">
                <Building2 className="h-5 w-5" />
                <span>Sites</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/attendance"}
              asChild
            >
              <a href="/attendance">
                <ClipboardList className="h-5 w-5" />
                <span>Attendance</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/payroll"}
              asChild
            >
              <a href="/payroll">
                <DollarSign className="h-5 w-5" />
                <span>Payroll</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/inventory"}
              asChild
            >
              <a href="/inventory">
                <PackageOpen className="h-5 w-5" />
                <span>Inventory</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/reports"}
              asChild
            >
              <a href="/reports">
                <LineChart className="h-5 w-5" />
                <span>Reports</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Admin-only menu items */}
          {isAdmin && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={location.pathname === "/users"}
                  asChild
                >
                  <a href="/users">
                    <Users className="h-5 w-5" />
                    <span>Users</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={location.pathname === "/settings"}
                  asChild
                >
                  <a href="/settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={location.pathname === "/iot-controls"}
                  asChild
                >
                  <a href="/iot-controls">
                    <Wifi className="h-5 w-5" />
                    <span>IoT Controls</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs opacity-60">{user?.role || "User"}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
