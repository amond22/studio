
"use client";

import { useState } from "react";
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

const MOCK_STUDENTS = [
  { id: "S202", name: "Alice Johnson", faculty: "BIT", semester: 4, attendance: 92, status: "Normal" },
  { id: "S303", name: "Mark Evans", faculty: "BIT", semester: 4, attendance: 65, status: "Warning" },
  { id: "S404", name: "Sarah Connor", faculty: "BIT", semester: 4, attendance: 78, status: "Normal" },
  { id: "S505", name: "David Miller", faculty: "BIT", semester: 4, attendance: 85, status: "Normal" },
  { id: "S606", name: "Emily Blunt", faculty: "BBA", semester: 2, attendance: 45, status: "Critical" },
  { id: "S707", name: "James Wilson", faculty: "BHM", semester: 1, attendance: 88, status: "Normal" },
  { id: "S808", name: "Sophia Loren", faculty: "BBA", semester: 4, attendance: 72, status: "Warning" },
  { id: "S909", name: "Marcus Wright", faculty: "BIT", semester: 4, attendance: 95, status: "Normal" },
];

export default function TeacherReportsPage() {
  const [search, setSearch] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");
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
    const matchesSemester = semesterFilter === "all" || s.semester.toString() === semesterFilter;
    return matchesSearch && matchesFaculty && matchesSemester;
  });

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
            <div className="text-2xl font-bold text-primary">82.4%</div>
            <p className="text-[10px] text-green-600 mt-1 font-medium">+2.4% vs last week</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_STUDENTS.length}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Across all faculties</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow border-l-4 border-l-destructive">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Critical (&lt;75%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {MOCK_STUDENTS.filter(s => s.attendance < 75).length} Students
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Action required</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Sessions Logged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">124</div>
            <p className="text-[10px] text-muted-foreground mt-1">Current semester</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Student Performance Ledger</CardTitle>
              <CardDescription>Comprehensive attendance history and department status</CardDescription>
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
                {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                  <TableRow 
                    key={student.id} 
                    className="cursor-pointer group hover:bg-muted/20 transition-colors"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20 overflow-hidden">
                          <img src={`https://picsum.photos/seed/${student.id}/50/50`} alt="" />
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
                          <span className={student.attendance < 75 ? "text-destructive" : "text-primary"}>
                            {student.attendance}%
                          </span>
                        </div>
                        <Progress 
                          value={student.attendance} 
                          className={cn(
                            "h-1.5",
                            student.attendance < 75 ? "bg-destructive/10" : "bg-primary/10"
                          )}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={cn(
                          "text-[9px] h-5 font-bold border-none",
                          student.status === "Critical" ? "bg-destructive/10 text-destructive" :
                          student.status === "Warning" ? "bg-orange-100 text-orange-700" :
                          "bg-green-100 text-green-700"
                        )}
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 group-hover:bg-primary/10 rounded-full">
                        <ChevronRight className="w-4 h-4 text-primary" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2 opacity-50">
                        <Search className="w-10 h-10" />
                        <p>No student records found matching filters.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Comprehensive Student Audit Modal */}
      <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedStudent && (
            <>
              <DialogHeader className="flex flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-primary/20 overflow-hidden shrink-0">
                  <img src={`https://picsum.photos/seed/${selectedStudent.id}/150/150`} alt="" className="w-full h-full object-cover" />
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
                  <TabsTrigger value="history">Daily Session Log</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/40 rounded-2xl flex flex-col items-center text-center">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Total Attendance</p>
                      <p className={cn(
                        "text-3xl font-bold",
                        selectedStudent.attendance < 75 ? "text-destructive" : "text-primary"
                      )}>{selectedStudent.attendance}%</p>
                      <Badge className="mt-2 text-[9px]" variant={selectedStudent.status === 'Critical' ? 'destructive' : 'default'}>
                        {selectedStudent.status} Status
                      </Badge>
                    </div>
                    <div className="p-4 bg-muted/40 rounded-2xl flex flex-col items-center text-center">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Classes Attended</p>
                      <p className="text-3xl font-bold">92 / 100</p>
                      <p className="text-[10px] text-muted-foreground mt-2 italic">8 Classes Missed</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <h4 className="text-sm font-bold">Subject-wise Breakdown</h4>
                    </div>
                    {[
                      { name: "Cloud Computing (BIT-401)", rate: 95, sessions: "24/25" },
                      { name: "Database Systems (BIT-302)", rate: 88, sessions: "22/25" },
                      { name: "Java Programming (BIT-205)", rate: selectedStudent.attendance - 12, sessions: "18/25" },
                    ].map((sub, i) => (
                      <div key={i} className="p-4 border rounded-xl space-y-2 hover:bg-muted/10 transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold">{sub.name}</span>
                          <span className="text-xs font-mono text-primary font-bold">{sub.rate}%</span>
                        </div>
                        <Progress value={sub.rate} className="h-1.5" />
                        <p className="text-[10px] text-muted-foreground text-right">{sub.sessions} sessions present</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="history" className="py-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">
                      <span>Recent Classes</span>
                      <span>Status</span>
                    </div>
                    {[
                      { date: "Today, 10:15 AM", subject: "Cloud Computing", status: "Present" },
                      { date: "Yesterday, 09:02 AM", subject: "Database Systems", status: "Present" },
                      { date: "Mar 15, 2024", subject: "Java Programming", status: "Late" },
                      { date: "Mar 14, 2024", subject: "Cloud Computing", status: "Present" },
                      { date: "Mar 12, 2024", subject: "Database Systems", status: "Absent" },
                    ].map((log, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-xl hover:border-primary transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            log.status === 'Present' ? "bg-green-100" : 
                            log.status === 'Late' ? "bg-orange-100" : "bg-red-100"
                          )}>
                            <Clock className={cn(
                              "w-3 h-3",
                              log.status === 'Present' ? "text-green-700" : 
                              log.status === 'Late' ? "text-orange-700" : "text-red-700"
                            )} />
                          </div>
                          <div>
                            <p className="text-xs font-bold">{log.subject}</p>
                            <p className="text-[10px] text-muted-foreground">{log.date}</p>
                          </div>
                        </div>
                        <Badge 
                          className={cn(
                            "text-[9px] h-4 font-bold border-none",
                            log.status === "Present" ? "bg-green-50 text-green-700" :
                            log.status === "Late" ? "bg-orange-50 text-orange-700" :
                            "bg-red-50 text-red-700"
                          )}
                        >
                          {log.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-4 text-xs font-bold text-primary">
                    View Full 90-Day History
                  </Button>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="mt-6">
                <div className="flex w-full gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedStudent(null)}>Close</Button>
                  <Button className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Export Detail
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
