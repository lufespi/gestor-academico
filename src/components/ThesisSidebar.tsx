import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  FileText,
  ClipboardList,
  BookOpen,
  UserCheck,
  BarChart3
} from "lucide-react";

const coordinatorItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Students", url: "/students", icon: Users },
  { title: "Professors", url: "/professors", icon: GraduationCap },
  { title: "Assignments", url: "/assignments", icon: UserCheck },
  { title: "Deadlines", url: "/deadlines", icon: Calendar },
  { title: "Review Panels", url: "/review-panels", icon: ClipboardList },
  { title: "Reports", url: "/reports", icon: BarChart3 },
];

const professorItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Advisees", url: "/advisees", icon: Users },
  { title: "Grading", url: "/grading", icon: ClipboardList },
  { title: "Calendar", url: "/calendar", icon: Calendar },
];

const studentItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Project", url: "/project", icon: FileText },
  { title: "Meetings", url: "/meetings", icon: BookOpen },
  { title: "Deadlines", url: "/deadlines", icon: Calendar },
];

export function ThesisSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  // For demo purposes, we'll use coordinator items
  // In a real app, this would be determined by user role
  const [userRole] = useState<'coordinator' | 'professor' | 'student'>('coordinator');
  
  const getMenuItems = () => {
    switch (userRole) {
      case 'coordinator':
        return coordinatorItems;
      case 'professor':
        return professorItems;
      case 'student':
        return studentItems;
      default:
        return coordinatorItems;
    }
  };

  const menuItems = getMenuItems();
  const isActive = (path: string) => currentPath === path;

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-primary text-primary-foreground font-medium shadow-sm"
      : "hover:bg-accent hover:text-accent-foreground transition-colors";

  const getRoleLabel = () => {
    switch (userRole) {
      case 'coordinator':
        return 'Coordinator';
      case 'professor':
        return 'Professor';
      case 'student':
        return 'Student';
      default:
        return 'Dashboard';
    }
  };

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} transition-all duration-300 border-r bg-card`}>
      <SidebarContent className="p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-semibold text-foreground">Thesis Manager</h2>
                <p className="text-xs text-muted-foreground">{getRoleLabel()}</p>
              </div>
            )}
          </div>
          <SidebarTrigger className="w-full justify-center" />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full">
                    <NavLink to={item.url} className={getNavClassName}>
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}