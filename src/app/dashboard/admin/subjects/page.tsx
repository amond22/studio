"use client";

import { BookOpen, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const mockSubjects = [
  { id: "1", code: "BIT-401", name: "Cloud Computing", faculty: "BIT", semester: 7 },
  { id: "2", code: "BIT-302", name: "Database Systems", faculty: "BIT", semester: 5 },
  { id: "3", code: "BBA-201", name: "Microeconomics", faculty: "BBA", semester: 3 },
];

export default function SubjectsManagementPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-primary">Subjects</h1>
        </div>
        <Button className="button-hover">
          <Plus className="w-4 h-4 mr-2" />
          Add Subject
        </Button>
      </div>

      <div className="flex gap-4">
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
        {mockSubjects.map((sub) => (
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
