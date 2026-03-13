
"use client";

import { useEffect, useState } from "react";
import { User, getCurrentUser, getStoredUsers, getStoredSubjects, getAttendanceRecords, AttendanceRecord } from "@/lib/auth-store";
import { motion } from "framer-motion";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  Sparkles,
  QrCode,
  Plus,
  Calendar as CalendarIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ScheduledClass {
  startTime: string;
  endTime: string;
  subject: string;
  room: string;
}

export default function DashboardHome() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    attendanceRate: 0,
    activeSubjects: 0
  });
  const [studentRecords, setStudentRecords] = useState<AttendanceRecord[]>([]);
  
  const [scheduledClasses, setScheduledClasses] = useState<ScheduledClass[]>([
    { startTime: "09:00 AM", endTime: "10:30 AM", subject: "Database Systems", room: "L-202" },
    { startTime: "11:30 AM", endTime: "01:00 PM", subject: "Object Oriented Programming", room: "L-101" }
  ]);
  const [newClass, setNewClass] = useState({ start: "", end: "", subject: "", room: "" });
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      const allUsers = getStoredUsers();
      const allSubjects = getStoredSubjects();
      const allRecords = getAttendanceRecords();

      // Calculate Stats
      const students = allUsers.filter(u => u.role === 'Student');
      const teachers = allUsers.filter(u => u.role === 'Teacher');
      const avgRate = students.length > 0 
        ? students.reduce((acc, s) => acc + (s.attendanceRate || 0), 0) / students.length 
        : 0;

      setStats({
        totalStudents: students.length,
        totalTeachers: teachers.length,
        attendanceRate: Math.round(avgRate),
        activeSubjects: allSubjects.length
      });

      // Filter student records if applicable
      if (currentUser.role === 'Student') {
        const myRecords = allRecords
          .filter(r => r.studentId === currentUser.id)
          .sort((a, b) => new Date(b.timestamp || b.date).getTime() - new Date(a.timestamp || a.date).getTime())
          .slice(0, 5);
        setStudentRecords(myRecords);
      }
    }
  }, []);

  if (!user) return null;

  const handleAddClass = () => {
    if (!newClass.start || !newClass.subject) return;
    setScheduledClasses([...scheduledClasses, {
      startTime: newClass.start,
      endTime: newClass.end,
      subject: newClass.subject,
      room: newClass.room || "TBD"
    }]);
    setNewClass({ start: "", end: "", subject: "", room: "" });
    setIsAddClassOpen(false);
  };

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
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Registered in database</p>
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
            <div className="text-2xl font-bold">{stats.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">Active faculty members</p>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div variants={item}>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">Average across all students</p>
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
            <div className="text-2xl font-bold">{stats.activeSubjects}</div>
            <p className="text-xs text-muted-foreground">Currently offered</p>
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Classes</CardTitle>
            <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 gap-1">
                  <Plus className="w-3.5 h-3.5" />
                  Schedule
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule Today's Class</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Subject Name</Label>
                    <Input 
                      placeholder="e.g. Cloud Computing" 
                      value={newClass.subject} 
                      onChange={(e) => setNewClass({...newClass, subject: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input 
                        type="text" 
                        placeholder="09:00 AM" 
                        value={newClass.start} 
                        onChange={(e) => setNewClass({...newClass, start: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input 
                        type="text" 
                        placeholder="10:30 AM" 
                        value={newClass.end} 
                        onChange={(e) => setNewClass({...newClass, end: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Room No.</Label>
                    <Input 
                      placeholder="e.g. L-201" 
                      value={newClass.room} 
                      onChange={(e) => setNewClass({...newClass, room: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddClass} className="w-full">Save Schedule</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledClasses.map((cls, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-primary/10 flex flex-col items-center justify-center text-primary leading-none">
                      <Clock className="w-3.5 h-3.5 mb-1" />
                      <span className="text-xs font-bold">{cls.startTime.split(' ')[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{cls.subject}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="bg-muted px-1.5 py-0.5 rounded">{cls.room}</span>
                        <span>•</span>
                        <span>{cls.startTime} - {cls.endTime}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => router.push('/dashboard/teacher/qr')}>
                    Start QR
                  </Button>
                </div>
              ))}
              {scheduledClasses.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>No classes scheduled for today.</p>
                </div>
              )}
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
            Mark your attendance for the current session. Make sure you are within class range.
          </p>
          <Button variant="secondary" className="w-full button-hover font-bold" onClick={() => router.push('/dashboard/student/scan')}>
            Open Scanner
          </Button>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 md:col-span-2 border-none shadow-sm">
        <CardHeader>
          <CardTitle>Recent Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentRecords.length > 0 ? (
              studentRecords.map((rec, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border-b last:border-0">
                  <div className="flex items-center gap-4">
                    {rec.status === 'Present' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-orange-500" />
                    )}
                    <div>
                      <p className="font-medium">{rec.subjectName}</p>
                      <p className="text-xs text-muted-foreground">
                        {rec.date} {rec.timestamp ? `at ${new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase",
                    rec.status === 'Present' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                  )}>
                    {rec.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No attendance records found yet.</p>
              </div>
            )}
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
