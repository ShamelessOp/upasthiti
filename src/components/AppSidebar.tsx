
import { Sidebar, SidebarFooter, SidebarNav, SidebarNavItem } from "@/components/ui/sidebar";
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
      <SidebarNav className="my-4">
        <SidebarNavItem
          icon={<Building2 className="h-5 w-5" />}
          href="/sites"
          text="Sites"
          isActive={location.pathname === "/sites" || location.pathname.startsWith("/sites/")}
        />
        <SidebarNavItem
          icon={<ClipboardList className="h-5 w-5" />}
          href="/attendance"
          text="Attendance"
          isActive={location.pathname === "/attendance"}
        />
        <SidebarNavItem
          icon={<DollarSign className="h-5 w-5" />}
          href="/payroll"
          text="Payroll"
          isActive={location.pathname === "/payroll"}
        />
        <SidebarNavItem
          icon={<PackageOpen className="h-5 w-5" />}
          href="/inventory"
          text="Inventory"
          isActive={location.pathname === "/inventory"}
        />
        <SidebarNavItem
          icon={<LineChart className="h-5 w-5" />}
          href="/reports"
          text="Reports"
          isActive={location.pathname === "/reports"}
        />
        
        {/* Admin-only menu items */}
        {isAdmin && (
          <>
            <SidebarNavItem
              icon={<Users className="h-5 w-5" />}
              href="/users"
              text="Users"
              isActive={location.pathname === "/users"}
            />
            <SidebarNavItem
              icon={<Settings className="h-5 w-5" />}
              href="/settings"
              text="Settings"
              isActive={location.pathname === "/settings"}
            />
            <SidebarNavItem
              icon={<Wifi className="h-5 w-5" />}
              href="/iot-controls"
              text="IoT Controls"
              isActive={location.pathname === "/iot-controls"}
            />
          </>
        )}
      </SidebarNav>
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
