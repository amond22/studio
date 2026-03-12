
"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Plus, MoreVertical, Edit, Trash2, BookOpen, ChevronRight } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { Faculty, getStoredFaculties, saveFaculties } from "@/lib/auth-store";

export default function FacultyManagementPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Form
  const [code, setCode] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    setFaculties(getStoredFaculties());
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
    saveFaculties(updated);
    toast({ title: "Faculty Created", description: `${fullName} has been added.` });
    setOpen(false);
    setCode("");
    setFullName("");
  };

  const handleDelete = (id: string) => {
    const updated = faculties.filter(f => f.id !== id);
    setFaculties(updated);
    saveFaculties(updated);
    toast({ title: "Faculty Removed", description: "The faculty has been deleted from the records." });
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
          <Card 
            key={fac.id} 
            className="border-none shadow-sm group hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-primary group-hover:underline underline-offset-4">{fac.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{fac.longName}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(fac.id)}>
                    <Trash2 className="w-4 h-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg group-hover:bg-primary/5 transition-colors">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Semesters</p>
                  <p className="text-xl font-bold">{fac.semesters}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg group-hover:bg-primary/5 transition-colors">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Subjects</p>
                  <p className="text-xl font-bold">{fac.subjects}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4 group-hover:bg-primary group-hover:text-white transition-all"
                onClick={() => router.push('/dashboard/admin/subjects')}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Manage Subjects
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
