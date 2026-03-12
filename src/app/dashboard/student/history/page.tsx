"use client";

import { Calendar, Search, Filter, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const history = [
  { id: "1", subject: "Cloud Computing", date: "2024-03-15", time: "10:15 AM", status: "Present" },
  { id: "2", subject: "Digital Logic", date: "2024-03-14", time: "09:02 AM", status: "Present" },
  { id: "3", subject: "Java Lab", date: "2024-03-12", time: "11:45 AM", status: "Late" },
  { id: "4", subject: "Microprocessors", date: "2024-03-10", time: "09:00 AM", status: "Absent" },
];

export default function StudentHistoryPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Calendar className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-headline font-bold text-primary">Attendance History</h1>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by subject or date..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <div className="divide-y">
            {history.map((record) => (
              <div key={record.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  {record.status === "Present" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  {record.status === "Late" && <Clock className="w-5 h-5 text-orange-500" />}
                  {record.status === "Absent" && <XCircle className="w-5 h-5 text-destructive" />}
                  
                  <div>
                    <p className="font-bold text-foreground">{record.subject}</p>
                    <p className="text-xs text-muted-foreground">{record.date} &bull; {record.time}</p>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={
                    record.status === "Present" ? "text-green-600 border-green-200 bg-green-50" :
                    record.status === "Late" ? "text-orange-600 border-orange-200 bg-orange-50" :
                    "text-destructive border-destructive/20 bg-destructive/5"
                  }
                >
                  {record.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
