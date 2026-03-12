
"use client";

import { FileText, Download, GraduationCap, Calendar, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TeacherReportsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-primary">Class Reports</h1>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download Monthly
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Subject Summaries</CardTitle>
            <CardDescription>Overall performance for your active subjects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { subject: "Database Systems", students: 45, avg: "88%" },
              { subject: "Cloud Computing", students: 38, avg: "94%" },
            ].map((sub, i) => (
              <div key={i} className="p-4 border rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-bold">{sub.subject}</p>
                  <p className="text-xs text-muted-foreground">{sub.students} Enrolled Students</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">{sub.avg}</p>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Avg. Attendance</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>Download logs for the last few classes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { date: "Today, 09:00 AM", subject: "DBS", count: 42 },
              { date: "Yesterday, 11:30 AM", subject: "Cloud", count: 35 },
              { date: "Mar 12, 09:00 AM", subject: "DBS", count: 40 },
            ].map((session, i) => (
              <button key={i} className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div className="text-left">
                    <p className="text-sm font-medium">{session.date}</p>
                    <p className="text-xs text-muted-foreground">{session.subject}</p>
                  </div>
                </div>
                <Badge variant="secondary">{session.count} Present</Badge>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
