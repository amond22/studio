
"use client";

import { useEffect, useState } from "react";
import { User, getCurrentUser } from "@/lib/auth-store";
import { motion } from "framer-motion";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  Sparkles,
  QrCode
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function DashboardHome() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  if (!user) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const AdminStats = () => (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div variants={item}>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div variants={item}>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86</div>
            <p className="text-xs text-muted-foreground">3 new recently added</p>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div variants={item}>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">Highest this semester</p>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div variants={item}>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Across 3 faculties</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );

  const TeacherView = () => (
    <div className="space-y-8">
      <AdminStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              AI Attendance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Our GenAI engine is analyzing attendance patterns for your subjects.
              </p>
              <div className="p-4 bg-muted/50 rounded-lg border border-dashed text-center">
                <p className="text-sm font-medium mb-3">Identify at-risk students instantly</p>
                <Button onClick={() => router.push('/dashboard/teacher/insights')} className="button-hover">
                  Generate Analysis
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "09:00 AM", subject: "Database Systems", room: "L-202" },
                { time: "11:30 AM", subject: "Object Oriented Programming", room: "L-101" }
              ].map((cls, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {cls.time.split(':')[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{cls.subject}</p>
                      <p className="text-xs text-muted-foreground">{cls.room}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => router.push('/dashboard/teacher/qr')}>
                    Start QR
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const StudentView = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="col-span-1 md:col-span-1 border-none shadow-sm bg-primary text-primary-foreground overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <QrCode className="w-24 h-24" />
        </div>
        <CardHeader>
          <CardTitle>Ready to Scan?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-primary-foreground/80 text-sm mb-6">
            Make sure you are connected to Balmiki_Lincoln_WiFi to mark your attendance.
          </p>
          <Button variant="secondary" className="w-full button-hover font-bold" onClick={() => router.push('/dashboard/student/scan')}>
            Open Scanner
          </Button>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 md:col-span-2 border-none shadow-sm">
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { status: 'Present', subject: 'Cloud Computing', date: 'Today', time: '10:15 AM' },
              { status: 'Present', subject: 'Digital Logic', date: 'Yesterday', time: '09:02 AM' },
              { status: 'Late', subject: 'Java Lab', date: 'Mar 12, 2024', time: '11:45 AM' }
            ].map((rec, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border-b last:border-0">
                <div className="flex items-center gap-4">
                  {rec.status === 'Present' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-orange-500" />
                  )}
                  <div>
                    <p className="font-medium">{rec.subject}</p>
                    <p className="text-xs text-muted-foreground">{rec.date} at {rec.time}</p>
                  </div>
                </div>
                <span className={cn(
                  "px-2 py-1 rounded text-[10px] font-bold uppercase",
                  rec.status === 'Present' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                )}>
                  {rec.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">
          Welcome, {user.name}
        </h1>
        <p className="text-muted-foreground">
          {user.role} Dashboard &bull; {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {user.role === "Admin" && <AdminStats />}
      {user.role === "Teacher" && <TeacherView />}
      {user.role === "Student" && <StudentView />}
    </div>
  );
}
