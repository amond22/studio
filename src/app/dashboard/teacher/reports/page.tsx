
"use client";

import { useState } from "react";
import { FileText, Download, GraduationCap, Calendar, BarChart, Users, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const MOCK_STUDENTS = [
  { id: "S202", name: "Alice Johnson", faculty: "BIT", semester: 4, attendance: 92, status: "Normal" },
  { id: "S303", name: "Mark Evans", faculty: "BIT", semester: 4, attendance: 65, status: "Warning" },
  { id: "S404", name: "Sarah Connor", faculty: "BIT", semester: 4, attendance: 78, status: "Normal" },
  { id: "S505", name: "David Miller", faculty: "BIT", semester: 4, attendance: 85, status: "Normal" },
  { id: "S606", name: "Emily Blunt", faculty: "BIT", semester: 4, attendance: 45, status: "Critical" },
];

export default function TeacherReportsPage() {
  const [search, setSearch] = useState("");

  const filteredStudents = MOCK_STUDENTS.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-primary">Attendance Reports</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            PDF Report
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Average Class Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">82.4%</div>
            <p className="text-xs text-muted-foreground mt-1">+2.4% from last week</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Critical Attendance ( < 75% )</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">12 Students</div>
            <p className="text-xs text-muted-foreground mt-1">Requires immediate notice</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
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
              <CardDescription>Detailed attendance breakdown by student for Cloud Computing</CardDescription>
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search student name..." 
                className="pl-10" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
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
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <p className="font-bold">{student.name}</p>
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
                      <Button variant="ghost" size="sm" className="h-8">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
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
}
