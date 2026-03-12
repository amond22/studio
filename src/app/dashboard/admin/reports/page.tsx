
"use client";

import { useState } from "react";
import { FileText, Download, TrendingUp, Users, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function AdminReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDownload = (type: string, name: string) => {
    setDownloading(name);
    setTimeout(() => {
      setDownloading(null);
      toast({
        title: "Download Complete",
        description: `${name} has been saved as a ${type} file.`,
      });
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-primary">System Reports</h1>
        </div>
        <Button 
          variant="outline"
          onClick={() => handleDownload('ZIP', 'Full System Audit')}
          disabled={!!downloading}
        >
          {downloading === 'Full System Audit' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Export All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm cursor-pointer hover:bg-muted/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Attendance</CardTitle>
            <TrendingUp className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.4%</div>
            <Button variant="link" className="px-0 h-auto text-xs">View detail</Button>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm cursor-pointer hover:bg-muted/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,142</div>
            <Button variant="link" className="px-0 h-auto text-xs">View detail</Button>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm cursor-pointer hover:bg-muted/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">482</div>
            <Button variant="link" className="px-0 h-auto text-xs">View detail</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Recent Activity Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Attendance Summary - March 2024", date: "Mar 15, 2024", type: "PDF" },
              { name: "Faculty Engagement Audit", date: "Mar 12, 2024", type: "Excel" },
              { name: "Network Access Logs", date: "Mar 10, 2024", type: "CSV" },
            ].map((report, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-lg">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-xs text-muted-foreground">Generated on {report.date}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  disabled={downloading === report.name}
                  onClick={() => handleDownload(report.type, report.name)}
                >
                  {downloading === report.name ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Download {report.type}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
