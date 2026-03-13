
"use client";

import { useState, useEffect } from "react";
import { 
  FileText, Download, TrendingUp, Users, Calendar, 
  Loader2, BarChart3, PieChart, Phone, Search, 
  ChevronRight, AlertTriangle, GraduationCap, 
  BookOpen, Mail 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getStoredUsers, getAttendanceRecords, User, getStoredFaculties, Faculty } from "@/lib/auth-store";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, Pie, PieChart as RechartsPieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function AdminReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalStudents: 0, totalRecords: 0, avgRate: 0 });
  const [students, setStudents] = useState<User[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const allUsers = getStoredUsers();
    const studentsList = allUsers.filter(u => u.role === 'Student');
    const records = getAttendanceRecords();
    const facultiesList = getStoredFaculties();
    
    setStudents(studentsList);
    setFaculties(facultiesList);

    const avg = studentsList.length > 0 ? studentsList.reduce((a, b) => a + (b.attendanceRate || 0), 0) / studentsList.length : 0;
    
    setStats({
      totalStudents: studentsList.length,
      totalRecords: records.length,
      avgRate: Math.round(avg)
    });
  }, []);

  const handleDownload = (name: string) => {
    setDownloading(name);
    setTimeout(() => {
      setDownloading(null);
      toast({ title: "Report Exported", description: `${name} has been downloaded successfully.` });
    }, 1500);
  };

  const getStatus = (rate: number) => {
    if (rate < 60) return "Critical";
    if (rate < 75) return "Warning";
    return "Normal";
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFaculty = facultyFilter === "all" || s.faculty === facultyFilter;
    const matchesSemester = semesterFilter === "all" || s.semester?.toString() === semesterFilter;
    return matchesSearch && matchesFaculty && matchesSemester;
  });

  const facultyData = faculties.map(f => {
    const studentCount = students.filter(s => s.faculty === f.id).length;
    return { name: f.id, value: studentCount, fill: studentCount > 0 ? "hsl(var(--primary))" : "hsl(var(--muted))" };
  }).filter(f => f.value > 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-primary">Academic Reports</h1>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => handleDownload('Master Attendance Sheet')} disabled={!!downloading} className="flex-1 sm:flex-none">
            {downloading === 'Master Attendance Sheet' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />} Export XLS
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase opacity-80">System-Wide Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.avgRate}%</div>
            <p className="text-[10px] opacity-70 mt-1">Average participation rate across all portals</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Active Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalStudents}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Total registered in academic database</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Total Sessions Logged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalRecords}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Confirmed audit logs from QR & Manual scans</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <PieChart className="w-4 h-4 text-primary" /> Faculty Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center">
            {facultyData.length > 0 ? (
               <ChartContainer config={{ value: { label: "Students", color: "hsl(var(--primary))" } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie data={facultyData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label />
                    <Tooltip content={<ChartTooltipContent />} />
                  </RechartsPieChart>
                </ResponsiveContainer>
               </ChartContainer>
            ) : (
              <p className="text-sm text-muted-foreground italic">No student data found for faculty charts.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> At-Risk Overview
            </CardTitle>
            <CardDescription>Students requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-destructive/5 rounded-xl border border-destructive/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-destructive uppercase tracking-widest">Critical Alert</span>
                <span className="text-xl font-bold text-destructive">{students.filter(s => (s.attendanceRate || 0) < 60).length} Students</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Attendance rate currently below the 60% requirement threshold.</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Warning Zone</span>
                <span className="text-xl font-bold text-orange-600">{students.filter(s => (s.attendanceRate || 0) >= 60 && (s.attendanceRate || 0) < 75).length} Students</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Attendance between 60% and 75%. Proactive monitoring advised.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Detailed Academic Ledger</CardTitle>
              <CardDescription>Drill-down by faculty, semester, and individual status</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[180px] flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search name or ID..." className="pl-10 h-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <Select value={facultyFilter} onValueChange={setFacultyFilter}>
                <SelectTrigger className="w-[110px] h-10"><SelectValue placeholder="Faculty" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {faculties.map(f => <SelectItem key={f.id} value={f.id}>{f.id}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                <SelectTrigger className="w-[110px] h-10"><SelectValue placeholder="Semester" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sems</SelectItem>
                  {[1,2,3,4,5,6,7,8].map(s => <SelectItem key={s} value={s.toString()}>Sem {s}</SelectItem>)}
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
                  <TableHead>Student Identity</TableHead>
                  <TableHead>Academic Path</TableHead>
                  <TableHead className="w-[200px]">Attendance Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const rate = student.attendanceRate || 0;
                  const status = getStatus(rate);
                  return (
                    <TableRow key={student.id} className="hover:bg-muted/10 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img src={student.photo} className="w-9 h-9 rounded-full border" alt="" />
                          <div>
                            <p className="font-bold text-sm leading-none">{student.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase mt-1 font-mono">{student.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" className="text-[9px] h-5 w-fit">{student.faculty}</Badge>
                          <span className="text-[10px] font-medium text-muted-foreground">Semester {student.semester}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-muted-foreground uppercase">Rate</span>
                            <span className={cn(rate < 60 ? "text-destructive" : "text-primary")}>{rate}%</span>
                          </div>
                          <Progress value={rate} className={cn("h-1.5", rate < 60 ? "[&>div]:bg-destructive" : "[&>div]:bg-primary")} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "text-[9px] h-5 border-none font-bold uppercase tracking-wider",
                          status === "Critical" ? "bg-destructive text-destructive-foreground" : 
                          status === "Warning" ? "bg-orange-100 text-orange-700" : 
                          "bg-green-100 text-green-700"
                        )}>
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {student.parentContact ? (
                             <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 text-primary border-primary/20 hover:bg-primary/10"
                              title={`Call Parent: ${student.parentContact}`}
                              asChild
                             >
                               <a href={`tel:${student.parentContact}`}>
                                 <Phone className="w-3.5 h-3.5" />
                               </a>
                             </Button>
                          ) : (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-30" disabled>
                              <Phone className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedStudent(student)}>
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                      No students found matching current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="sm:max-w-xl">
          {selectedStudent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <img src={selectedStudent.photo} className="w-10 h-10 rounded-full border" alt="" />
                  <div>
                    <p>{selectedStudent.name}</p>
                    <p className="text-xs font-normal text-muted-foreground uppercase">{selectedStudent.id}</p>
                  </div>
                </DialogTitle>
                <DialogDescription>Full academic engagement audit for {selectedStudent.faculty} Semester {selectedStudent.semester}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/5 rounded-2xl text-center border border-primary/10">
                    <p className="text-[10px] font-bold text-primary uppercase mb-1">Attendance Rate</p>
                    <p className="text-3xl font-bold text-primary">{selectedStudent.attendanceRate || 0}%</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-2xl flex flex-col justify-center items-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Contact Status</p>
                    {selectedStudent.parentContact ? (
                      <Button variant="link" className="h-auto p-0 font-bold flex items-center gap-1" asChild>
                        <a href={`tel:${selectedStudent.parentContact}`}>
                          <Phone className="w-3.5 h-3.5" /> {selectedStudent.parentContact}
                        </a>
                      </Button>
                    ) : (
                      <p className="text-xs font-bold text-destructive">No Parent Contact</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Recent Activity Logs
                  </h4>
                  <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                    {getAttendanceRecords().filter(r => r.studentId === selectedStudent.id).length > 0 ? (
                      getAttendanceRecords()
                        .filter(r => r.studentId === selectedStudent.id)
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((r, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-white border rounded-xl hover:shadow-sm transition-shadow">
                            <div>
                              <p className="text-xs font-bold text-foreground">{r.subjectName}</p>
                              <p className="text-[9px] text-muted-foreground">{r.date} &bull; {r.markedBy}</p>
                            </div>
                            <Badge className={cn(
                              "text-[8px] h-4 border-none",
                              r.status === 'Present' ? "bg-green-50 text-green-700" : 
                              r.status === 'Late' ? "bg-orange-50 text-orange-700" : 
                              "bg-red-50 text-red-700"
                            )}>
                              {r.status}
                            </Badge>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-12 bg-muted/20 rounded-2xl border-2 border-dashed">
                        <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                        <p className="text-xs text-muted-foreground">No attendance sessions recorded yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                 <Button className="flex-1 font-bold" onClick={() => setSelectedStudent(null)}>Close Audit</Button>
                 {selectedStudent.parentContact && (
                   <Button variant="secondary" className="font-bold flex items-center gap-2" asChild>
                     <a href={`tel:${selectedStudent.parentContact}`}>
                       <Phone className="w-4 h-4" /> Call Now
                     </a>
                   </Button>
                 )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
