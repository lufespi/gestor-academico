import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
  { title: "Painel", url: "/dashboard", icon: LayoutDashboard },
  { title: "Alunos", url: "/students", icon: Users },
  { title: "Professores", url: "/professors", icon: GraduationCap },
  { title: "Orientações", url: "/assignments", icon: UserCheck },
  { title: "Cronograma", url: "/deadlines", icon: Calendar },
  { title: "Bancas", url: "/review-panels", icon: ClipboardList },
  { title: "Relatórios", url: "/reports", icon: BarChart3 },
];

const professorItems = [
  { title: "Painel", url: "/dashboard", icon: LayoutDashboard },
  { title: "Meus Orientandos", url: "/advisees", icon: Users },
  { title: "Avaliações", url: "/grading", icon: ClipboardList },
  { title: "Calendário", url: "/calendar", icon: Calendar },
];

const studentItems = [
  { title: "Painel", url: "/dashboard", icon: LayoutDashboard },
  { title: "Meu Projeto", url: "/my-project", icon: FileText },
  { title: "Reuniões", url: "/meetings", icon: BookOpen },
  { title: "Prazos", url: "/deadlines", icon: Calendar },
];

export function ThesisSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const { profile } = useAuth();
  const userRole = profile?.role || 'student';
  
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
      : "text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors";

  const getRoleLabel = () => {
    switch (userRole) {
      case "coordinator":
        return "Coordenador";
      case "professor":
        return "Professor";
      case "student":
        return "Aluno";
      default:
        return "Painel";
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
                <h2 className="font-semibold text-foreground">Gestor de TC</h2>
                <p className="text-xs text-muted-foreground">{getRoleLabel()}</p>
              </div>
            )}
          </div>
          <SidebarTrigger className="w-full justify-center" />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Navegação
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