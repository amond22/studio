
"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Search, Filter, CheckCircle2, XCircle, Clock, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAttendanceRecords, getCurrentUser, AttendanceRecord } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

export default function StudentHistoryPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const allRecords = getAttendanceRecords();
      // Filter for this student only
      const studentRecords = allRecords.filter(r => r.studentId === user.id);
      // Sort by newest first
      studentRecords.sort((a, b) => {
        const timeA = new Date(a.timestamp || a.date).getTime();
        const timeB = new Date(b.timestamp || b.date).getTime();
        return timeB - timeA;
      });
      setRecords(studentRecords);
    }
    setLoading(false);
  }, []);

  const filteredRecords = records.filter(r => 
    r.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.date.includes(searchQuery) ||
    r.markedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Grouping records by date for "day by day" detail view
  const groupedByDate = filteredRecords.reduce((acc, record) => {
    if (!acc[record.date]) acc[record.date] = [];
    acc[record.date].push(record);
    return acc;
  }, {} as Record<string, AttendanceRecord[]>);

  // Get sorted dates
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Clock className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CalendarIcon className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-headline font-bold text-primary">Attendance History</h1>
            <p className="text-muted-foreground text-sm">Full audit trail of your scanned sessions</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border shadow-sm">
          <div className="px-3 py-1 text-center">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Total Sessions</p>
            <p className="text-xl font-bold text-primary">{records.length}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by subject or date (YYYY-MM-DD)..." 
            className="pl-10 h-11 border-muted-foreground/20 focus:ring-primary rounded-xl bg-white" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-8">
        {sortedDates.length > 0 ? (
          sortedDates.map((date) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="px-3 py-1 bg-white shadow-sm font-bold text-xs">
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Badge>
                <div className="h-px flex-1 bg-border" />
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {groupedByDate[date].map((record) => (
                  <Card key={record.id} className="border-none shadow-sm hover:shadow-md transition-all group">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                          record.status === "Present" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                        )}>
                          {record.status === "Present" ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                        </div>
                        
                        <div>
                          <p className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{record.subjectName}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {record.timestamp ? new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Session Logged'}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-medium bg-muted/50 px-2 py-0.5 rounded-full">{record.markedBy}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "font-bold uppercase tracking-widest text-[10px] px-3 py-1 rounded-full",
                            record.status === "Present" ? "text-green-600 border-green-200 bg-green-50" : "text-orange-600 border-orange-200 bg-orange-50"
                          )}
                        >
                          {record.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-muted-foreground/10">
            <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No Records Found</h3>
            <p className="text-muted-foreground max-w-xs mx-auto mt-2">
              {searchQuery ? "Try adjusting your search filters." : "Your attendance logs will appear here once you start scanning QR codes in class."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
