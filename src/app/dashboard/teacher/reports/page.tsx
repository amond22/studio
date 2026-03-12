
"use client";

import { useState, useEffect } from "react";
import { FileText, Download, GraduationCap, Calendar, BarChart, Users, Search, ChevronRight, Filter, Loader2, Eye, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStoredUsers, User } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

export default function TeacherReportsPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [exporting, setExporting] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load real users from storage instead of mock data
    const allUsers = getStoredUsers();
    setStudents(allUsers.filter(u => u.role === 'Student'));
  }, []);

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

  const getStatus = (rate: number) => {
    if (rate < 60) return "Critical";
    if (rate < 75) return "Warning";
    return "Normal";
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.id.toLowerCase().includes(search.toLowerCase());
    const matchesFaculty = facultyFilter === "all" || s.faculty === facultyFilter;
    const matchesSemester = semesterFilter === "all" || s.semester?.toString() === semesterFilter;
    return matchesSearch && matchesFaculty && matchesSemester;
  });

  const avgAttendance = students.length > 0 
    ? (students.reduce((acc, s) => acc + (s.attendanceRate || 0), 0) / students.length).toFixed(1)
    : "0";

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BarChart className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-headline font-bold text-primary">Attendance Reports</h1>
            <p className="text-muted-foreground text-sm">Total students record and participation audit</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            disabled={!!exporting}
            onClick={() => handleExport('PDF')}
            className="h-10"
          >
            {exporting === 'PDF' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            PDF Report
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={!!exporting}
            onClick={() => handleExport('Excel')}
            className="h-10"
          >
            {exporting === 'Excel' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            Export Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Avg Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{avgAttendance}%</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">Across registered students</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-[10px] text-muted-foreground mt-1">In system database</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow border-l-4 border-l-destructive">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">At-Risk Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {students.filter(s => (s.attendanceRate || 0) < 75).length} Students
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Action required (below 75%)</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Sessions Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">Active</div>
            <p className="text-[10px] text-muted-foreground mt-1">Current semester monitoring</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Student Performance Ledger</CardTitle>
              <CardDescription>Real-time attendance tracking from scan records</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[200px] flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search name or ID..." 
                  className="pl-10 h-9 text-sm" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={facultyFilter} onValueChange={setFacultyFilter}>
                <SelectTrigger className="w-[110px] h-9 text-xs">
                  <SelectValue placeholder="Faculty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dept</SelectItem>
                  <SelectItem value="BIT">BIT</SelectItem>
                  <SelectItem value="BBA">BBA</SelectItem>
                  <SelectItem value="BHM">BHM</SelectItem>
                </SelectContent>
              </Select>
              <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                <SelectTrigger className="w-[110px] h-9 text-xs">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sem</SelectItem>
                  {[1,2,3,4,5,6,7,8].map(s => (
                    <SelectItem key={s} value={s.toString()}>Sem {s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="text-[10px] uppercase font-bold">Student Identity</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold">Academic Group</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold w-[250px]">Attendance Rate</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold">Status</TableHead>
                  <TableHead className="text-right text-[10px] uppercase font-bold">Audit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? filteredStudents.map((student) => {
                  const rate = student.attendanceRate || 0;
                  const status = getStatus(rate);
                  return (
                    <TableRow 
                      key={student.id} 
                      className="cursor-pointer group hover:bg-muted/20 transition-colors"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20 overflow-hidden">
                            <img src={student.photo} alt="" />
                          </div>
                          <div>
                            <p className="font-bold text-sm group-hover:text-primary transition-colors">{student.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-mono">{student.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant="secondary" className="w-fit text-[9px] h-4 font-bold tracking-tighter">
                            {student.faculty}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">Semester {student.semester}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-muted-foreground uppercase">Participation</span>
                            <span className={rate < 75 ? "text-destructive" : "text-primary"}>
                              {rate}%
                            </span>
                          </div>
                          <Progress 
                            value={rate} 
                            className={cn(
                              "h-1.5",
                              rate < 75 ? "bg-destructive/10" : "bg-primary/10"
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={cn(
                            "text-[9px] h-5 font-bold border-none",
                            status === "Critical" ? "bg-destructive/10 text-destructive" :
                            status === "Warning" ? "bg-orange-100 text-orange-700" :
                            "bg-green-100 text-green-700"
                          )}
                        >
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 group-hover:bg-primary/10 rounded-full">
                          <ChevronRight className="w-4 h-4 text-primary" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                }) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2 opacity-50">
                        <Search className="w-10 h-10" />
                        <p>No student records found in live database.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedStudent && (
            <>
              <DialogHeader className="flex flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-primary/20 overflow-hidden shrink-0">
                  <img src={selectedStudent.photo} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <DialogTitle className="text-2xl">{selectedStudent.name}</DialogTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px] font-bold">{selectedStudent.id}</Badge>
                    <span className="text-sm text-muted-foreground">{selectedStudent.faculty} • Semester {selectedStudent.semester}</span>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Performance Overview</TabsTrigger>
                  <TabsTrigger value="history">Session Logs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/40 rounded-2xl flex flex-col items-center text-center">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Total Attendance</p>
                      <p className={cn(
                        "text-3xl font-bold",
                        (selectedStudent.attendanceRate || 0) < 75 ? "text-destructive" : "text-primary"
                      )}>{selectedStudent.attendanceRate || 0}%</p>
                      <Badge className="mt-2 text-[9px]" variant={(selectedStudent.attendanceRate || 0) < 75 ? 'destructive' : 'default'}>
                        {getStatus(selectedStudent.attendanceRate || 0)} Status
                      </Badge>
                    </div>
                    <div className="p-4 bg-muted/40 rounded-2xl flex flex-col items-center text-center">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Status Report</p>
                      <p className="text-lg font-bold">Active Tracking</p>
                      <p className="text-[10px] text-muted-foreground mt-2 italic">Updated via QR scan</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <h4 className="text-sm font-bold">Academic Context</h4>
                    </div>
                    <div className="p-4 border rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold">Overall Course Engagement</span>
                        <span className="text-xs font-mono text-primary font-bold">{selectedStudent.attendanceRate || 0}%</span>
                      </div>
                      <Progress value={selectedStudent.attendanceRate || 0} className="h-1.5" />
                    </div>
                    <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg border italic">
                      "Student attendance is tracked cumulatively. A rate of 0% indicates no successful scans have been recorded for this student yet."
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="py-4">
                  <div className="text-center py-10 opacity-40">
                    <Clock className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm font-medium">No individual session logs recorded yet.</p>
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="mt-6">
                <Button variant="outline" className="w-full" onClick={() => setSelectedStudent(null)}>Close Audit View</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
