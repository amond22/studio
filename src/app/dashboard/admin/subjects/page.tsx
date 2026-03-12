
"use client";

import { useState, useEffect } from "react";
import { BookOpen, Plus, Search, Filter, ChevronRight, Eye, Layers, User as UserIcon, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getStoredUsers, User } from "@/lib/auth-store";

interface Subject {
  id: string;
  code: string;
  name: string;
  faculty: string;
  semester: number;
  teacherId?: string;
  teacherName?: string;
}

export default function SubjectsManagementPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [facultyFilter, setFacultyFilter] = useState("all");
  const { toast } = useToast();

  // Form
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [faculty, setFaculty] = useState("BIT");
  const [semester, setSemester] = useState("1");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");

  useEffect(() => {
    const allUsers = getStoredUsers();
    setTeachers(allUsers.filter(u => u.role === 'Teacher'));

    const stored = localStorage.getItem('eduscan_subjects');
    if (stored) {
      setSubjects(JSON.parse(stored));
    } else {
      const initial = [
        { id: "1", code: "BIT-401", name: "Cloud Computing", faculty: "BIT", semester: 7, teacherName: "Dr. Robert Smith", teacherId: "teacher" },
        { id: "2", code: "BIT-302", name: "Database Systems", faculty: "BIT", semester: 5, teacherName: "Dr. Robert Smith", teacherId: "teacher" },
        { id: "3", code: "BBA-201", name: "Microeconomics", faculty: "BBA", semester: 3, teacherName: "Unassigned" },
      ];
      setSubjects(initial);
      localStorage.setItem('eduscan_subjects', JSON.stringify(initial));
    }
  }, []);

  const handleAdd = () => {
    if (!code || !name) return;
    
    const teacher = teachers.find(t => t.id === selectedTeacherId);
    
    const newSub: Subject = {
      id: Date.now().toString(),
      code,
      name,
      faculty,
      semester: parseInt(semester),
      teacherId: selectedTeacherId,
      teacherName: teacher ? teacher.name : "Unassigned"
    };
    
    const updated = [...subjects, newSub];
    setSubjects(updated);
    localStorage.setItem('eduscan_subjects', JSON.stringify(updated));
    toast({ title: "Subject Registered", description: `${name} has been assigned to ${newSub.teacherName}.` });
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setCode("");
    setName("");
    setFaculty("BIT");
    setSemester("1");
    setSelectedTeacherId("");
  };

  const handleSubjectClick = (sub: Subject) => {
    setSelectedSubject(sub);
    setDetailOpen(true);
  };

  const filteredSubjects = subjects.filter(sub => {
    const matchesSemester = semesterFilter === "all" || sub.semester.toString() === semesterFilter;
    const matchesFaculty = facultyFilter === "all" || sub.faculty === facultyFilter;
    return matchesSemester && matchesFaculty;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-primary">Academic Subjects</h1>
        </div>
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="button-hover w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Register Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Register New Subject</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subject Code</Label>
                  <Input placeholder="BIT-101" value={code} onChange={(e) => setCode(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Faculty</Label>
                  <Select value={faculty} onValueChange={setFaculty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BIT">BIT</SelectItem>
                      <SelectItem value="BBA">BBA</SelectItem>
                      <SelectItem value="BHM">BHM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subject Name</Label>
                <Input placeholder="Introduction to IT" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select value={semester} onValueChange={setSemester}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8].map(s => (
                        <SelectItem key={s} value={s.toString()}>Sem {s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Assign Teacher</Label>
                  <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full h-11" onClick={handleAdd}>Save Subject Mapping</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search subjects or codes..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Select value={facultyFilter} onValueChange={setFacultyFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Faculty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Faculties</SelectItem>
              <SelectItem value="BIT">BIT</SelectItem>
              <SelectItem value="BBA">BBA</SelectItem>
              <SelectItem value="BHM">BHM</SelectItem>
            </SelectContent>
          </Select>
          <Select value={semesterFilter} onValueChange={setSemesterFilter}>
            <SelectTrigger className="w-[120px]">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((sub) => (
          <Card 
            key={sub.id} 
            className="border-none shadow-sm hover:shadow-lg transition-all cursor-pointer group active:scale-[0.98] overflow-hidden"
            onClick={() => handleSubjectClick(sub)}
          >
            <CardHeader className="pb-3 bg-primary/5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {sub.code}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">{sub.faculty}</span>
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors leading-tight">
                {sub.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Layers className="w-3.5 h-3.5 text-primary/60" />
                  Semester {sub.semester}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-foreground/80">
                  <UserIcon className="w-3.5 h-3.5 text-accent" />
                  {sub.teacherName || "No Teacher Assigned"}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t flex justify-between items-center">
                <Button variant="ghost" size="sm" className="text-[10px] h-7 uppercase font-bold tracking-wider hover:bg-primary/5">
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  View Audit
                </Button>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="h-7 text-[10px] uppercase font-bold">Edit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredSubjects.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-2xl bg-muted/20">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="text-muted-foreground font-medium">No subjects found for the selected filters.</p>
          </div>
        )}
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedSubject && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <DialogTitle className="text-2xl">{selectedSubject.name}</DialogTitle>
                </div>
                <p className="text-sm text-muted-foreground font-medium pl-10">
                  {selectedSubject.code} &bull; {selectedSubject.faculty} &bull; Semester {selectedSubject.semester}
                </p>
              </DialogHeader>
              <div className="space-y-6 py-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-2xl border flex flex-col items-center">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Subject Teacher</p>
                    <div className="flex items-center gap-2">
                       <UserIcon className="w-4 h-4 text-accent" />
                       <p className="text-sm font-bold">{selectedSubject.teacherName || "Unassigned"}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-2xl border flex flex-col items-center">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Status</p>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Active</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      Class Statistics
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 border rounded-xl">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Sessions</p>
                      <p className="text-xl font-bold">24</p>
                    </div>
                    <div className="p-3 border rounded-xl">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Enrollment</p>
                      <p className="text-xl font-bold">42 Students</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                   <h4 className="text-sm font-bold">Recent Audit Logs</h4>
                   {[
                    { date: "Mar 15, 2024", count: 38, type: "QR Scan" },
                    { date: "Mar 12, 2024", count: 40, type: "Manual" },
                   ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/20 rounded-xl border border-transparent hover:border-primary/20 transition-all">
                      <div>
                        <p className="text-xs font-bold">{log.date}</p>
                        <p className="text-[10px] text-muted-foreground">{log.type} Entry</p>
                      </div>
                      <span className="text-sm font-bold text-primary">{log.count} Present</span>
                    </div>
                   ))}
                </div>
              </div>
              <DialogFooter>
                <Button className="w-full" variant="outline" onClick={() => setDetailOpen(false)}>Close Archive</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
