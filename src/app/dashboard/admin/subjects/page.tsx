
"use client";

import { useState, useEffect } from "react";
import { BookOpen, Plus, Search, Filter, ChevronRight, Eye, Layers } from "lucide-react";
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

interface Subject {
  id: string;
  code: string;
  name: string;
  faculty: string;
  semester: number;
}

export default function SubjectsManagementPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
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

  useEffect(() => {
    const stored = localStorage.getItem('eduscan_subjects');
    if (stored) {
      setSubjects(JSON.parse(stored));
    } else {
      const initial = [
        { id: "1", code: "BIT-401", name: "Cloud Computing", faculty: "BIT", semester: 7 },
        { id: "2", code: "BIT-302", name: "Database Systems", faculty: "BIT", semester: 5 },
        { id: "3", code: "BBA-201", name: "Microeconomics", faculty: "BBA", semester: 3 },
      ];
      setSubjects(initial);
      localStorage.setItem('eduscan_subjects', JSON.stringify(initial));
    }
  }, []);

  const handleAdd = () => {
    if (!code || !name) return;
    const newSub: Subject = {
      id: Date.now().toString(),
      code,
      name,
      faculty,
      semester: parseInt(semester)
    };
    const updated = [...subjects, newSub];
    setSubjects(updated);
    localStorage.setItem('eduscan_subjects', JSON.stringify(updated));
    toast({ title: "Subject Added", description: `${name} has been registered for Semester ${semester}.` });
    setOpen(false);
    setCode("");
    setName("");
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
          <h1 className="text-3xl font-headline font-bold text-primary">Subjects</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="button-hover w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
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
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-muted-foreground" />
                  Target Semester
                </Label>
                <Select value={semester} onValueChange={setSemester}>
                  <SelectTrigger className="border-primary/20 bg-primary/5 font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8].map(s => (
                      <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground italic">Subjects will be filtered by this semester in QR generation.</p>
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full" onClick={handleAdd}>Save Subject</Button>
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
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Faculty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
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
            className="border-none shadow-sm hover:shadow-lg transition-all cursor-pointer group active:scale-[0.98]"
            onClick={() => handleSubjectClick(sub)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded group-hover:bg-primary group-hover:text-white transition-colors">
                  {sub.code}
                </span>
                <span className="text-xs text-muted-foreground">{sub.faculty}</span>
              </div>
              <CardTitle className="text-xl font-bold mt-2 group-hover:text-primary transition-colors">{sub.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Layers className="w-3.5 h-3.5" />
                Semester {sub.semester}
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <Button variant="ghost" size="sm" className="text-xs h-8 hover:bg-primary/5">
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  View Records
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-8">Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredSubjects.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-2xl bg-muted/20">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="text-muted-foreground">No subjects found for the selected filters.</p>
          </div>
        )}
      </div>

      {/* Subject Details Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent>
          {selectedSubject && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedSubject.name}</DialogTitle>
                <p className="text-sm text-muted-foreground">{selectedSubject.code} &bull; {selectedSubject.faculty} &bull; Semester {selectedSubject.semester}</p>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-xl text-center">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Total Classes</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                  <div className="p-4 bg-muted rounded-xl text-center">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Students</p>
                    <p className="text-2xl font-bold">42</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-bold">Recent Sessions</h4>
                  {[
                    { date: "Mar 15, 2024", count: 38 },
                    { date: "Mar 12, 2024", count: 40 },
                    { date: "Mar 08, 2024", count: 35 },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">{s.date}</span>
                      <span className="text-sm font-bold text-primary">{s.count} Scans</span>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button className="w-full" variant="outline" onClick={() => setDetailOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
