
"use client";

import { useState, useEffect } from "react";
import { BarChart, Users, Search, ChevronRight, Filter, Loader2, BarChart3, TrendingUp, BookOpen, Clock, Download } from "lucide-react";
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
import { getStoredUsers, User, getAttendanceRecords, AttendanceRecord } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function TeacherReportsPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [search, setSearch] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [exporting, setExporting] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setStudents(getStoredUsers().filter(u => u.role === 'Student'));
    setRecords(getAttendanceRecords());
  }, []);

  const handleExport = (type: string) => {
    setExporting(type);
    setTimeout(() => {
      setExporting(null);
      toast({ title: "Export Success", description: `Data exported as ${type}.` });
    }, 1500);
  };

  const getStatus = (rate: number) => {
    if (rate < 60) return "Critical";
    if (rate < 75) return "Warning";
    return "Normal";
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchesFaculty = facultyFilter === "all" || s.faculty === facultyFilter;
    const matchesSemester = semesterFilter === "all" || s.semester?.toString() === semesterFilter;
    return matchesSearch && matchesFaculty && matchesSemester;
  });

  const chartData = [
    { name: "BIT", avg: 88 },
    { name: "BBA", avg: 82 },
    { name: "BHM", avg: 79 },
  ];

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
            <p className="text-muted-foreground text-sm">Real-time participation audits and analytics</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={!!exporting} onClick={() => handleExport('PDF')}>
            {exporting === 'PDF' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />} Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Faculty Performance Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             <ChartContainer config={{ 
               avg: { label: "Average Attendance", color: "hsl(var(--primary))" } 
             }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis hide />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "hsl(var(--primary))" : "hsl(var(--accent))"} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
             </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          <Card className="border-none shadow-sm border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Overall Class Avg</p>
              <h3 className="text-3xl font-bold text-primary">{avgAttendance}%</h3>
              <p className="text-[10px] text-muted-foreground mt-2">Active across {students.length} students</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm border-l-4 border-l-destructive">
            <CardContent className="pt-6">
              <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">At-Risk Count</p>
              <h3 className="text-3xl font-bold text-destructive">
                {students.filter(s => (s.attendanceRate || 0) < 75).length}
              </h3>
              <p className="text-[10px] text-muted-foreground mt-2">Students below 75% threshold</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Student Performance Ledger</CardTitle>
              <CardDescription>Live tracking from scan & manual records</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[200px] flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search name or ID..." className="pl-10 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={facultyFilter} onValueChange={setFacultyFilter}>
                <SelectTrigger className="w-[110px] h-9"><SelectValue placeholder="Faculty" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="BIT">BIT</SelectItem>
                  <SelectItem value="BBA">BBA</SelectItem>
                  <SelectItem value="BHM">BHM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Academic</TableHead>
                <TableHead className="w-[200px]">Attendance</TableHead>
                <TableHead>Status</TableHead>
                <th className="text-right p-4">Audit</th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const rate = student.attendanceRate || 0;
                const status = getStatus(rate);
                return (
                  <TableRow key={student.id} className="cursor-pointer" onClick={() => setSelectedStudent(student)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img src={student.photo} className="w-8 h-8 rounded-full" alt="" />
                        <div><p className="font-bold text-xs">{student.name}</p><p className="text-[8px] uppercase">{student.id}</p></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[8px] h-4">{student.faculty} S{student.semester}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[8px] font-bold"><span>RATE</span><span>{rate}%</span></div>
                        <Progress value={rate} className="h-1" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("text-[8px] h-4 border-none", status === "Critical" ? "bg-red-100 text-red-700" : status === "Warning" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700")}>
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right"><ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="sm:max-w-xl">
          {selectedStudent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedStudent.name}</DialogTitle>
                <CardDescription>{selectedStudent.id} • {selectedStudent.faculty} • Semester {selectedStudent.semester}</CardDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Attendance Rate</p>
                    <p className="text-2xl font-bold text-primary">{selectedStudent.attendanceRate || 0}%</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Status</p>
                    <p className="text-lg font-bold">{getStatus(selectedStudent.attendanceRate || 0)}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-bold">Recent History</h4>
                  <div className="max-h-[200px] overflow-y-auto space-y-2">
                    {records.filter(r => r.studentId === selectedStudent.id).length > 0 ? (
                      records.filter(r => r.studentId === selectedStudent.id).map((r, i) => (
                        <div key={i} className="flex justify-between p-2 border rounded text-xs">
                          <span>{r.date} • {r.subjectName}</span>
                          <Badge variant="outline" className="text-[8px]">{r.status}</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-4">No specific logs recorded yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
