
"use client";

import { useState } from "react";
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

export default function FacultyManagementPage() {
  const [faculties, setFaculties] = useState([
    { id: 1, name: "BIT", longName: "Bachelor of Information Technology", semesters: 8, subjects: 42 },
    { id: 2, name: "BBA", longName: "Bachelor of Business Administration", semesters: 8, subjects: 38 },
    { id: 3, name: "BHM", longName: "Bachelor of Hotel Management", semesters: 8, subjects: 35 },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-primary">Faculties</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="button-hover">
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
                <Input placeholder="BIT" />
              </div>
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="Bachelor of Science in IT" />
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full">Create Faculty</Button>
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
