
"use client";

import { useState } from "react";
import { Sparkles, BarChart3, Users, AlertCircle, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { teacherAttendanceInsights, TeacherAttendanceInsightsOutput } from "@/ai/flows/teacher-attendance-insights";
import { motion, AnimatePresence } from "framer-motion";

export default function AIInsightsPage() {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<TeacherAttendanceInsightsOutput | null>(null);

  const generateInsights = async () => {
    setLoading(true);
    try {
      // Mock data for the GenAI flow
      const result = await teacherAttendanceInsights({
        teacherName: "Dr. Robert Smith",
        classSubject: "Database Systems (BIT)",
        timePeriod: "Last 30 Days",
        attendanceRecords: [
          { studentName: "Alice Johnson", studentId: "S202", subject: "DBS", date: "2024-03-01", time: "09:00", status: "Present" },
          { studentName: "Alice Johnson", studentId: "S202", subject: "DBS", date: "2024-03-05", time: "09:10", status: "Late" },
          { studentName: "Mark Evans", studentId: "S303", subject: "DBS", date: "2024-03-01", time: "09:00", status: "Absent" },
          { studentName: "Mark Evans", studentId: "S303", subject: "DBS", date: "2024-03-05", time: "09:00", status: "Absent" },
          { studentName: "Mark Evans", studentId: "S303", subject: "DBS", date: "2024-03-08", time: "09:00", status: "Absent" },
          { studentName: "Sarah Connor", studentId: "S404", subject: "DBS", date: "2024-03-01", time: "09:15", status: "Late" },
          { studentName: "Sarah Connor", studentId: "S404", subject: "DBS", date: "2024-03-05", time: "09:20", status: "Late" },
          { studentName: "Sarah Connor", studentId: "S404", subject: "DBS", date: "2024-03-08", time: "09:22", status: "Late" },
        ]
      });
      setInsights(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-xl">
            <Sparkles className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-headline font-bold text-primary">Attendance Insights</h1>
            <p className="text-muted-foreground">AI-powered pattern analysis for Dr. Robert Smith</p>
          </div>
        </div>
        {!insights && (
          <Button onClick={generateInsights} disabled={loading} className="button-hover h-11 px-8">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Analyze Patterns
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!insights ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { title: "Identify At-Risk", icon: Users, desc: "Find students with falling attendance before it becomes critical." },
              { title: "Predict Trends", icon: BarChart3, desc: "See which days or subjects have the lowest engagement." },
              { title: "Personalized Alerts", icon: AlertCircle, desc: "Get specific issues identified for each struggling student." }
            ].map((feature, i) => (
              <Card key={i} className="border-none shadow-sm group hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
                    <feature.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <Card className="border-none shadow-sm bg-accent/5 overflow-hidden">
              <CardHeader className="border-b bg-white/50">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-lg leading-relaxed text-foreground/90 italic">
                  "{insights.summary}"
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-destructive" />
                    At-Risk Students
                  </CardTitle>
                  <CardDescription>Direct intervention recommended for these students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {insights.atRiskStudents.map((student, idx) => (
                      <div key={idx} className="p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-primary">{student.studentName}</p>
                          <span className="text-xs font-mono text-muted-foreground">{student.studentId}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {student.issues.map((issue, i) => (
                            <span key={i} className="px-2 py-0.5 bg-destructive/10 text-destructive text-[10px] font-bold uppercase rounded">
                              {issue}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Recommended Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Send automated warning email to Mark Evans",
                      "Schedule one-on-one meeting with Sarah Connor regarding lateness",
                      "Check if Alice Johnson has a transport issue (late 10% of time)",
                      "Review Monday morning scheduling (highest absence day)"
                    ].map((action, i) => (
                      <button key={i} className="w-full flex items-center justify-between p-3 rounded-lg border hover:border-primary group transition-all">
                        <span className="text-sm text-left">{action}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      </button>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-6" onClick={() => setInsights(null)}>
                    Refresh Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
