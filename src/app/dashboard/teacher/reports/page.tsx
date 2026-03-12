
"use client";

import { useState } from "react";
import { FileText, Download, GraduationCap, Calendar, BarChart, Users, Search, ChevronRight, Filter, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const MOCK_STUDENTS = [
  { id: "S202", name: "Alice Johnson", faculty: "BIT", semester: 4, attendance: 92, status: "Normal" },
  { id: "S303", name: "Mark Evans", faculty: "BIT", semester: 4, attendance: 65, status: "Warning" },
  { id: "S404", name: "Sarah Connor", faculty: "BIT", semester: 4, attendance: 78, status: "Normal" },
  { id: "S505", name: "David Miller", faculty: "BIT", semester: 4, attendance: 85, status: "Normal" },
  { id: "S606", name: "Emily Blunt", faculty: "BBA", semester: 2, attendance: 45, status: "Critical" },
  { id: "S707", name: "James Wilson", faculty: "BHM", semester: 1, attendance: 88, status: "Normal" },
  { id: "S808", name: "Sophia Loren", faculty: "BBA", semester: 4, attendance: 72, status: "Warning" },
];

export default function TeacherReportsPage() {
  const [search, setSearch] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [exporting, setExporting] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const { toast } = useToast();

  const handleExport = (type: string) => {
    setExporting(type);
    setTimeout(() => {
      setExporting(null);
      toast({
        title: "Export Success",
        description: `Class attendance data has been exported as ${type}.`,
      });
    }, 1500);
  };

  const filteredStudents = MOCK_STUDENTS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.id.toLowerCase().includes(search.toLowerCase());
    const matchesFaculty = facultyFilter === "all" || s.faculty === facultyFilter;
    return matchesSearch && matchesFaculty;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-primary">Attendance Reports</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            disabled={!!exporting}
            onClick={() => handleExport('PDF')}
          >
            {exporting === 'PDF' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            PDF Report
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={!!exporting}
            onClick={() => handleExport('Excel')}
          >
            {exporting === 'Excel' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            Export Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm cursor-pointer hover:bg-muted/20 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Average Class Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">82.4%</div>
            <p className="text-xs text-muted-foreground mt-1">+2.4% from last week</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm cursor-pointer hover:bg-muted/20 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Critical Attendance ( &lt; 75% )</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">12 Students</div>
            <p className="text-xs text-muted-foreground mt-1">Requires immediate notice</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm cursor-pointer hover:bg-muted/20 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Total Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">48 Sessions</div>
            <p className="text-xs text-muted-foreground mt-1">This semester so far</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Student Performance Ledger</CardTitle>
              <CardDescription>Detailed attendance breakdown by faculty and semester</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search student name..." 
                  className="pl-10" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-40">
                <Select value={facultyFilter} onValueChange={setFacultyFilter}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="w-3 h-3" />
                      <SelectValue placeholder="Faculty" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="BIT">BIT</SelectItem>
                    <SelectItem value="BBA">BBA</SelectItem>
                    <SelectItem value="BHM">BHM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Faculty/Sem</TableHead>
                  <TableHead>Attendance Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                  <TableRow 
                    key={student.id} 
                    className="cursor-pointer group hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-bold group-hover:text-primary transition-colors">{student.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-mono">{student.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="h-5 text-[10px]">{student.faculty}</Badge>
                        <span className="text-xs">Sem {student.semester}</span>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[200px]">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span>Progress</span>
                          <span className={student.attendance < 75 ? "text-destructive" : "text-primary"}>
                            {student.attendance}%
                          </span>
                        </div>
                        <Progress 
                          value={student.attendance} 
                          className={student.attendance < 75 ? "bg-destructive/10" : "bg-primary/10"}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          student.status === "Critical" ? "bg-destructive/10 text-destructive border-none" :
                          student.status === "Warning" ? "bg-orange-100 text-orange-700 border-none" :
                          "bg-green-100 text-green-700 border-none"
                        }
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 hover:bg-primary/10">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1 text-primary" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      No students found in the selected faculty.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Student Detail Modal */}
      <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedStudent && (
            <>
              <DialogHeader>
                <DialogTitle>Attendance Audit: {selectedStudent.name}</DialogTitle>
                <p className="text-sm text-muted-foreground">{selectedStudent.id} &bull; {selectedStudent.faculty} Sem {selectedStudent.semester}</p>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="p-4 bg-muted rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Current Rate</p>
                    <p className="text-3xl font-bold text-primary">{selectedStudent.attendance}%</p>
                  </div>
                  <Badge className={selectedStudent.status === 'Critical' ? 'bg-destructive' : 'bg-primary'}>
                    {selectedStudent.status}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-sm font-bold">Subject Breakdown</h4>
                  {[
                    { name: "Cloud Computing", rate: 95 },
                    { name: "Database Systems", rate: 88 },
                    { name: "Digital Logic", rate: selectedStudent.attendance - 10 },
                  ].map((sub, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{sub.name}</span>
                        <span className="font-bold">{sub.rate}%</span>
                      </div>
                      <Progress value={sub.rate} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button className="w-full" onClick={() => setSelectedStudent(null)}>Close Audit</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
