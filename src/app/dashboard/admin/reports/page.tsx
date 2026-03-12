
"use client";

import { useState, useEffect } from "react";
import { FileText, Download, TrendingUp, Users, Calendar, Loader2, BarChart3, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getStoredUsers, getAttendanceRecords } from "@/lib/auth-store";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, Pie, PieChart as RechartsPieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function AdminReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalStudents: 0, totalRecords: 0, avgRate: 0 });
  const { toast } = useToast();

  useEffect(() => {
    const students = getStoredUsers().filter(u => u.role === 'Student');
    const records = getAttendanceRecords();
    const avg = students.length > 0 ? students.reduce((a, b) => a + (b.attendanceRate || 0), 0) / students.length : 0;
    setStats({
      totalStudents: students.length,
      totalRecords: records.length,
      avgRate: Math.round(avg)
    });
  }, []);

  const handleDownload = (type: string, name: string) => {
    setDownloading(name);
    setTimeout(() => {
      setDownloading(null);
      toast({ title: "Download Complete", description: `${name} saved.` });
    }, 1500);
  };

  const facultyData = [
    { name: "BIT", value: 45, fill: "hsl(var(--primary))" },
    { name: "BBA", value: 35, fill: "hsl(var(--accent))" },
    { name: "BHM", value: 20, fill: "hsl(var(--muted-foreground))" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-primary">System Reports</h1>
        </div>
        <Button variant="outline" onClick={() => handleDownload('ZIP', 'Full System Audit')} disabled={!!downloading}>
          {downloading === 'Full System Audit' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />} Export All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase opacity-80">Avg Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.avgRate}%</div>
            <p className="text-[10px] opacity-70 mt-1">System-wide average participation</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Registered Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalStudents}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Across all active faculties</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Sessions Recorded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalRecords}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Total entries in audit logs</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <PieChart className="w-4 h-4 text-primary" /> Student Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             <ChartContainer config={{ value: { label: "Students %", color: "hsl(var(--primary))" } }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie data={facultyData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label />
                  <Tooltip content={<ChartTooltipContent />} />
                </RechartsPieChart>
              </ResponsiveContainer>
             </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity Reports</CardTitle>
            <CardDescription>Generated data snapshots for administration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Monthly Attendance Summary", date: "Mar 15, 2024", type: "PDF" },
                { name: "Faculty Engagement Audit", date: "Mar 12, 2024", type: "Excel" },
                { name: "Manual Entry Audit Trail", date: "Mar 10, 2024", type: "CSV" },
              ].map((report, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:border-primary transition-colors">
                  <div>
                    <p className="text-sm font-medium">{report.name}</p>
                    <p className="text-[10px] text-muted-foreground">Generated on {report.date}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(report.type, report.name)}>
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
