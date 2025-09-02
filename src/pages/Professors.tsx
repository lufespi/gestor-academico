import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  MoreHorizontal,
  Filter,
  Download,
  GraduationCap
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Professors = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const professors = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      email: "sarah.chen@university.edu",
      department: "Computer Science",
      specialization: "Machine Learning & AI",
      adviseeCount: 8,
      status: "Active"
    },
    {
      id: 2,
      name: "Prof. Michael Rodriguez",
      email: "m.rodriguez@university.edu",
      department: "Urban Planning",
      specialization: "Sustainable Development",
      adviseeCount: 5,
      status: "Active"
    },
    {
      id: 3,
      name: "Dr. James Lee",
      email: "james.lee@university.edu",
      department: "Business Administration",
      specialization: "Blockchain & FinTech",
      adviseeCount: 6,
      status: "Active"
    },
    {
      id: 4,
      name: "Prof. Emily Martinez",
      email: "e.martinez@university.edu",
      department: "Engineering",
      specialization: "Renewable Energy",
      adviseeCount: 7,
      status: "Active"
    },
    {
      id: 5,
      name: "Dr. Robert Johnson",
      email: "r.johnson@university.edu",
      department: "Philosophy",
      specialization: "Ethics & AI",
      adviseeCount: 3,
      status: "On Leave"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "On Leave":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const filteredProfessors = professors.filter(professor =>
    professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Professor Management</h1>
          <p className="text-muted-foreground">
            Manage faculty members and their thesis supervision
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add New Professor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">24</CardTitle>
            <CardDescription>Total Professors</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">20</CardTitle>
            <CardDescription>Active</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">127</CardTitle>
            <CardDescription>Total Advisees</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">5.3</CardTitle>
            <CardDescription>Avg. Advisees per Prof.</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Professors Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Faculty List
              </CardTitle>
              <CardDescription>
                All faculty members eligible for thesis supervision
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search professors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Advisees</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfessors.map((professor) => (
                  <TableRow key={professor.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{professor.name}</div>
                        <div className="text-sm text-muted-foreground">{professor.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{professor.department}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={professor.specialization}>
                        {professor.specialization}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {professor.adviseeCount} students
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(professor.status)}>
                        {professor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            Edit Professor
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            View Advisees
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            Assign Students
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Professors;