import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  UserCheck,
  Filter,
  Check,
  X
} from "lucide-react";

const Assignments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState("");

  const assignments = [
    {
      id: 1,
      student: "Alice Johnson",
      professor: "Dr. Sarah Chen",
      projectTitle: "Machine Learning Applications in Healthcare",
      assignedDate: "2024-01-15",
      status: "Active"
    },
    {
      id: 2,
      student: "Bob Smith",
      professor: "Prof. Michael Rodriguez",
      projectTitle: "Sustainable Urban Planning Strategies",
      assignedDate: "2024-01-20",
      status: "Active"
    },
    {
      id: 3,
      student: "Carol Davis",
      professor: "Dr. James Lee",
      projectTitle: "Blockchain in Supply Chain Management",
      assignedDate: "2024-02-01",
      status: "Active"
    },
    {
      id: 4,
      student: "David Wilson",
      professor: "Prof. Emily Martinez",
      projectTitle: "Renewable Energy Storage Solutions",
      assignedDate: "2024-02-10",
      status: "Completed"
    }
  ];

  const unassignedStudents = [
    { id: 5, name: "Emma Brown", email: "emma.brown@university.edu" },
    { id: 6, name: "Frank Miller", email: "frank.miller@university.edu" },
    { id: 7, name: "Grace Wilson", email: "grace.wilson@university.edu" }
  ];

  const availableProfessors = [
    { id: 1, name: "Dr. Sarah Chen", adviseeCount: 8, maxAdvisees: 10 },
    { id: 2, name: "Prof. Michael Rodriguez", adviseeCount: 5, maxAdvisees: 8 },
    { id: 3, name: "Dr. James Lee", adviseeCount: 6, maxAdvisees: 9 },
    { id: 4, name: "Prof. Emily Martinez", adviseeCount: 7, maxAdvisees: 10 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const filteredAssignments = assignments.filter(assignment =>
    assignment.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.professor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Student-Advisor Assignments</h1>
          <p className="text-muted-foreground">
            Manage relationships between students and their thesis advisors
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">42</CardTitle>
            <CardDescription>Active Assignments</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">3</CardTitle>
            <CardDescription>Unassigned Students</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">18</CardTitle>
            <CardDescription>Available Professor Slots</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">5.2</CardTitle>
            <CardDescription>Avg. Students per Advisor</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* New Assignment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Assignment
            </CardTitle>
            <CardDescription>
              Assign a student to an advisor for thesis supervision
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Student</label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an unassigned student" />
                </SelectTrigger>
                <SelectContent>
                  {unassignedStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Select Professor</label>
              <Select value={selectedProfessor} onValueChange={setSelectedProfessor}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an available professor" />
                </SelectTrigger>
                <SelectContent>
                  {availableProfessors.map((professor) => (
                    <SelectItem key={professor.id} value={professor.id.toString()}>
                      {professor.name} ({professor.adviseeCount}/{professor.maxAdvisees})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full gap-2" disabled={!selectedStudent || !selectedProfessor}>
              <UserCheck className="w-4 h-4" />
              Create Assignment
            </Button>
          </CardContent>
        </Card>

        {/* Professor Availability */}
        <Card>
          <CardHeader>
            <CardTitle>Professor Availability</CardTitle>
            <CardDescription>
              Current advisor capacity and availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableProfessors.map((professor) => (
                <div key={professor.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{professor.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {professor.adviseeCount} of {professor.maxAdvisees} students
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div
                        className="h-2 bg-primary rounded-full transition-all"
                        style={{ 
                          width: `${(professor.adviseeCount / professor.maxAdvisees) * 100}%` 
                        }}
                      />
                    </div>
                    {professor.adviseeCount < professor.maxAdvisees ? (
                      <Badge className="bg-green-100 text-green-800">Available</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">Full</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Assignments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Current Assignments
              </CardTitle>
              <CardDescription>
                All active student-advisor relationships
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
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
                placeholder="Search assignments..."
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
                  <TableHead>Student</TableHead>
                  <TableHead>Advisor</TableHead>
                  <TableHead>Project Title</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.student}</TableCell>
                    <TableCell>{assignment.professor}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={assignment.projectTitle}>
                        {assignment.projectTitle}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(assignment.assignedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="text-green-600">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
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

export default Assignments;