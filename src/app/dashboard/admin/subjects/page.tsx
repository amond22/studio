
"use client";

import { useState, useEffect } from "react";
import { BookOpen, Plus, Search, Filter } from "lucide-react";
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
    toast({ title: "Subject Added", description: `${name} has been registered.` });
    setOpen(false);
    setCode("");
    setName("");
  };

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
                <Label>Semester</Label>
                <Select value={semester} onValueChange={setSemester}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8].map(s => (
                      <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full" onClick={handleAdd}>Save Subject</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search subjects..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((sub) => (
          <Card key={sub.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {sub.code}
                </span>
                <span className="text-xs text-muted-foreground">{sub.faculty}</span>
              </div>
              <CardTitle className="text-xl font-bold mt-2">{sub.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Semester {sub.semester}</p>
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <Button variant="ghost" size="sm" className="text-xs h-8">View Records</Button>
                <Button variant="outline" size="sm" className="text-xs h-8">Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
