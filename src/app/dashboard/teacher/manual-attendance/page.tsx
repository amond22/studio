
"use client";

import { useState, useEffect } from "react";
import { ClipboardCheck, Save, Users, Calendar as CalendarIcon, BookOpen, Layers, Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getStoredUsers, User, markManualAttendance, getCurrentUser } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

const MOCK_SUBJECTS = [
  { id: "BIT-DBS", name: "Database Systems", faculty: "BIT", semester: 5 },
  { id: "BIT-OOP", name: "Object Oriented Programming", faculty: "BIT", semester: 3 },
  { id: "BIT-CC", name: "Cloud Computing", faculty: "BIT", semester: 7 },
  { id: "BBA-MKT", name: "Marketing Management", faculty: "BBA", semester: 4 },
  { id: "BBA-ACC", name: "Financial Accounting", faculty: "BBA", semester: 2 },
  { id: "BHM-FNB", name: "Food & Beverage", faculty: "BHM", semester: 1 },
];

export default function ManualAttendancePage() {
  const [faculty, setFaculty] = useState<string>("BIT");
  const [semester, setSemester] = useState<string>("5");
  const [section, setSection] = useState<string>("A");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<User[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>({});
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  useEffect(() => {
    const allUsers = getStoredUsers();
    const filtered = allUsers.filter(u => 
      u.role === 'Student' && 
      u.faculty === faculty && 
      u.semester?.toString() === semester
    );
    setStudents(filtered);
    
    // Initialize all as Present
    const initial: Record<string, 'Present' | 'Absent' | 'Late'> = {};
    filtered.forEach(s => initial[s.id] = 'Present');
    setAttendance(initial);
  }, [faculty, semester]);

  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    if (!subject) {
      toast({ variant: "destructive", title: "Missing Info", description: "Select a subject first." });
      return;
    }

    const selectedSubject = MOCK_SUBJECTS.find(s => s.id === subject);
    const records = students.map(s => ({
      studentId: s.id,
      studentName: s.name,
      subjectId: subject,
      subjectName: selectedSubject?.name || subject,
      faculty,
      semester: parseInt(semester),
      section,
      date,
      status: attendance[s.id],
      markedBy: currentUser?.name || 'Teacher'
    }));

    markManualAttendance(records);
    toast({ title: "Attendance Saved", description: `Successfully recorded attendance for ${date}` });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <ClipboardCheck className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Manual Attendance</h1>
          <p className="text-muted-foreground text-sm">Mark attendance for a specific session</p>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
          <CardDescription>Configure the session to load the student list</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Faculty</Label>
              <Select value={faculty} onValueChange={setFaculty}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BIT">BIT</SelectItem>
                  <SelectItem value="BBA">BBA</SelectItem>
                  <SelectItem value="BHM">BHM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Semester</Label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8].map(s => <SelectItem key={s} value={s.toString()}>Sem {s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Section</Label>
              <Select value={section} onValueChange={setSection}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Section A</SelectItem>
                  <SelectItem value="B">Section B</SelectItem>
                  <SelectItem value="C">Section C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label>Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger><SelectValue placeholder="Choose Subject" /></SelectTrigger>
                <SelectContent>
                  {MOCK_SUBJECTS.filter(s => s.faculty === faculty).map(sub => (
                    <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2 max-w-xs">
            <Label>Session Date</Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="pl-10" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle>Attendance Ledger</CardTitle>
            <CardDescription>{students.length} students found in {faculty} Sem {semester}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => {
              const allPresent: Record<string, 'Present' | 'Absent' | 'Late'> = {};
              students.forEach(s => allPresent[s.id] = 'Present');
              setAttendance(allPresent);
            }}>All Present</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[500px] overflow-y-auto">
            {students.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="bg-muted/30 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 text-left">Student Name & ID</th>
                    <th className="p-4 text-center">Status Selection</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {students.map(student => (
                    <tr key={student.id} className="hover:bg-muted/20">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={student.photo} className="w-8 h-8 rounded-full" alt="" />
                          <div>
                            <p className="font-bold">{student.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase">{student.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <Button 
                            variant={attendance[student.id] === 'Present' ? 'default' : 'outline'} 
                            size="sm" 
                            className={cn("h-8 gap-1", attendance[student.id] === 'Present' && "bg-green-600 hover:bg-green-700")}
                            onClick={() => handleStatusChange(student.id, 'Present')}
                          >
                            <Check className="w-3.5 h-3.5" /> Present
                          </Button>
                          <Button 
                            variant={attendance[student.id] === 'Late' ? 'default' : 'outline'} 
                            size="sm" 
                            className={cn("h-8 gap-1", attendance[student.id] === 'Late' && "bg-orange-500 hover:bg-orange-600")}
                            onClick={() => handleStatusChange(student.id, 'Late')}
                          >
                            <Clock className="w-3.5 h-3.5" /> Late
                          </Button>
                          <Button 
                            variant={attendance[student.id] === 'Absent' ? 'destructive' : 'outline'} 
                            size="sm" 
                            className="h-8 gap-1"
                            onClick={() => handleStatusChange(student.id, 'Absent')}
                          >
                            <X className="w-3.5 h-3.5" /> Absent
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-20 text-center text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No students found for this selection.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button size="lg" className="px-12 font-bold h-14 button-hover shadow-xl shadow-primary/20" onClick={handleSave} disabled={students.length === 0}>
          <Save className="w-4 h-4 mr-2" />
          Save Attendance Data
        </Button>
      </div>
    </div>
  );
}
