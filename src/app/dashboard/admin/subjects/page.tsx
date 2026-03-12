
"use client";

import { useState, useEffect } from "react";
import { BookOpen, Plus, Search, ChevronRight, Eye, Layers, User as UserIcon, GraduationCap, Trash2 } from "lucide-react";
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
import { getStoredUsers, User, Subject, getStoredSubjects, saveSubjects } from "@/lib/auth-store";

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
    setSubjects(getStoredSubjects());
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
    saveSubjects(updated);
    toast({ title: "Subject Registered", description: `${name} saved successfully.` });
    setOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    const updated = subjects.filter(s => s.id !== id);
    setSubjects(updated);
    saveSubjects(updated);
    toast({ title: "Subject Deleted", description: "The record has been permanently removed." });
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
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8].map(s => <SelectItem key={s} value={s.toString()}>Sem {s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Assign Teacher</Label>
                  <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                    <SelectTrigger><SelectValue placeholder="Select Teacher" /></SelectTrigger>
                    <SelectContent>
                      {teachers.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
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
          <Input placeholder="Search subjects..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Select value={facultyFilter} onValueChange={setFacultyFilter}>
            <SelectTrigger className="w-[120px]"><SelectValue placeholder="Faculty" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Faculties</SelectItem>
              <SelectItem value="BIT">BIT</SelectItem>
              <SelectItem value="BBA">BBA</SelectItem>
              <SelectItem value="BHM">BHM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((sub) => (
          <Card 
            key={sub.id} 
            className="border-none shadow-sm hover:shadow-lg transition-all group overflow-hidden"
          >
            <CardHeader className="pb-3 bg-primary/5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">{sub.code}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(sub.id)}>
                   <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <CardTitle className="text-xl font-bold">{sub.name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Layers className="w-3.5 h-3.5 text-primary/60" /> Semester {sub.semester}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-foreground/80">
                  <UserIcon className="w-3.5 h-3.5 text-accent" /> {sub.teacherName || "Unassigned"}
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-4 text-[10px] uppercase font-bold" onClick={() => handleSubjectClick(sub)}>
                <Eye className="w-3.5 h-3.5 mr-1.5" /> View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedSubject && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedSubject.name}</DialogTitle>
                <p className="text-sm text-muted-foreground">{selectedSubject.code} &bull; {selectedSubject.faculty} &bull; Semester {selectedSubject.semester}</p>
              </DialogHeader>
              <div className="py-6 space-y-4">
                <div className="p-4 bg-muted/30 rounded-2xl border">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Assigned Teacher</p>
                  <p className="text-sm font-bold">{selectedSubject.teacherName || "Unassigned"}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
