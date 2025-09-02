import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp 
} from "lucide-react";
import dashboardHero from "@/assets/dashboard-hero.jpg";

export function CoordinatorDashboard() {
  const stats = [
    {
      title: "Total Students",
      value: "48",
      change: "+4 this month",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Projects",
      value: "42",
      change: "6 submitted",
      icon: FileText,
      color: "text-green-600"
    },
    {
      title: "Upcoming Deadlines",
      value: "7",
      change: "Next: 3 days",
      icon: Calendar,
      color: "text-orange-600"
    },
    {
      title: "Overdue Items",
      value: "3",
      change: "Requires attention",
      icon: AlertTriangle,
      color: "text-red-600"
    }
  ];

  const projectStatuses = [
    { status: "Proposal", count: 12, color: "bg-blue-500", percentage: 25 },
    { status: "In Progress", count: 18, color: "bg-yellow-500", percentage: 38 },
    { status: "Submitted", count: 10, color: "bg-green-500", percentage: 21 },
    { status: "Graded", count: 8, color: "bg-purple-500", percentage: 17 }
  ];

  const recentActivities = [
    {
      student: "Alice Johnson",
      action: "Submitted final project",
      time: "2 hours ago",
      status: "success"
    },
    {
      student: "Bob Smith",
      action: "Missed proposal deadline",
      time: "1 day ago",
      status: "warning"
    },
    {
      student: "Carol Davis",
      action: "Started working with Prof. Martinez",
      time: "2 days ago",
      status: "info"
    },
    {
      student: "David Wilson",
      action: "Revised proposal approved",
      time: "3 days ago",
      status: "success"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-glow">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative flex items-center justify-between p-8 text-white">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight">Coordinator Dashboard</h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Manage thesis projects, track student progress, and coordinate with faculty members
            </p>
            <div className="flex gap-4 pt-4">
              <Button variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                View All Students
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Generate Report
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <img 
              src={dashboardHero} 
              alt="Academic Dashboard" 
              className="w-64 h-40 object-cover rounded-lg opacity-80"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Project Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Project Status Overview
            </CardTitle>
            <CardDescription>
              Current distribution of project statuses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projectStatuses.map((item) => (
              <div key={item.status} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.status}</span>
                  <span className="text-muted-foreground">{item.count} projects</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest updates from students and professors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className="mt-0.5">
                    {activity.status === 'success' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {activity.status === 'warning' && (
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    )}
                    {activity.status === 'info' && (
                      <Clock className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.student}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Activities
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks for thesis coordination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button className="h-20 flex-col gap-2" variant="outline">
              <Users className="w-6 h-6" />
              Add New Student
            </Button>
            <Button className="h-20 flex-col gap-2" variant="outline">
              <Calendar className="w-6 h-6" />
              Set Deadline
            </Button>
            <Button className="h-20 flex-col gap-2" variant="outline">
              <FileText className="w-6 h-6" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}