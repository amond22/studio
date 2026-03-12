
"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Plus, MoreVertical, Edit, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Faculty {
  id: string;
  name: string;
  longName: string;
  semesters: number;
  subjects: number;
}

export default function FacultyManagementPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Form
  const [code, setCode] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem('eduscan_faculties');
    if (stored) {
      setFaculties(JSON.parse(stored));
    } else {
      const initial = [
        { id: "BIT", name: "BIT", longName: "Bachelor of Information Technology", semesters: 8, subjects: 42 },
        { id: "BBA", name: "BBA", longName: "Bachelor of Business Administration", semesters: 8, subjects: 38 },
        { id: "BHM", name: "BHM", longName: "Bachelor of Hotel Management", semesters: 8, subjects: 35 },
      ];
      setFaculties(initial);
      localStorage.setItem('eduscan_faculties', JSON.stringify(initial));
    }
  }, []);

  const handleAdd = () => {
    if (!code || !fullName) return;
    const newFac: Faculty = {
      id: code,
      name: code,
      longName: fullName,
      semesters: 8,
      subjects: 0
    };
    const updated = [...faculties, newFac];
    setFaculties(updated);
    localStorage.setItem('eduscan_faculties', JSON.stringify(updated));
    toast({ title: "Faculty Created", description: `${fullName} has been added.` });
    setOpen(false);
    setCode("");
    setFullName("");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-primary">Faculties</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="button-hover w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Faculty
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Faculty</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Faculty Code (e.g., BIT)</Label>
                <Input placeholder="BIT" value={code} onChange={(e) => setCode(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="Bachelor of Science in IT" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full" onClick={handleAdd}>Create Faculty</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculties.map((fac) => (
          <Card key={fac.id} className="border-none shadow-sm group">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-primary">{fac.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{fac.longName}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="gap-2">
                    <Edit className="w-4 h-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-destructive">
                    <Trash2 className="w-4 h-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Semesters</p>
                  <p className="text-xl font-bold">{fac.semesters}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Subjects</p>
                  <p className="text-xl font-bold">{fac.subjects}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 group-hover:bg-primary group-hover:text-white transition-all">
                <BookOpen className="w-4 h-4 mr-2" />
                Manage Subjects
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
