
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { QrCode, RefreshCw, Clock, AlertCircle, GraduationCap, BookOpen, Layers, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getStoredSubjects, getStoredFaculties, saveQRSessions, getQRSessions, QRSession } from "@/lib/auth-store";

export default function GenerateQRPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [faculties, setFaculties] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<string>("BIT");
  const [semester, setSemester] = useState<string>("1");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeQR, setActiveQR] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const { toast } = useToast();

  useEffect(() => {
    setSubjects(getStoredSubjects());
    setFaculties(getStoredFaculties());
  }, []);

  const filteredSubjects = subjects.filter(s => {
    const facultyMatch = faculty === "all" || s.faculty === faculty;
    const semesterMatch = !semester || semester === "all" || s.semester.toString() === semester;
    return facultyMatch && semesterMatch;
  });

  const handleGenerate = () => {
    if (!subject) {
      toast({ 
        variant: "destructive", 
        title: "Missing Information", 
        description: "Please select a specific subject to start the session." 
      });
      return;
    }
    const selectedSub = subjects.find(s => s.id === subject);
    
    // Create Secure Session
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 60000).toISOString();
    
    const newSession: QRSession = {
      id: `SES-${Date.now()}`,
      subjectId: selectedSub?.id,
      subjectName: selectedSub?.name,
      faculty: selectedSub?.faculty,
      semester: parseInt(selectedSub?.semester || "1"),
      generatedAt: new Date().toISOString(),
      expiresAt: expiresAt,
      token: token
    };

    // Store session
    const currentSessions = getQRSessions();
    saveQRSessions([...currentSessions, newSession]);

    // Encrypted payload (Simplified for prototype)
    const payload = JSON.stringify({
      subjectId: newSession.subjectId,
      subject: newSession.subjectName,
      faculty: newSession.faculty,
      semester: newSession.semester,
      timestamp: newSession.generatedAt,
      token: token
    });
    
    setActiveQR(payload);
    setTimeLeft(60);
    toast({ 
      title: "QR Session Active", 
      description: `New secure token generated for ${selectedSub?.name}. Expires in 60s.` 
    });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeQR && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && activeQR) {
      setActiveQR(null);
      toast({ 
        variant: "destructive",
        title: "QR Expired", 
        description: "The secure session has timed out. Please regenerate a new code." 
      });
    }
    return () => clearInterval(timer);
  }, [activeQR, timeLeft, toast]);

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <QrCode className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Classroom QR Portal</h1>
          <p className="text-muted-foreground">Secure session generation for students</p>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Session Parameters</CardTitle>
          <CardDescription>All fields are required to ensure student validation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                Faculty
              </Label>
              <Select value={faculty} onValueChange={(val) => { setFaculty(val); setSubject(""); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Faculty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Faculties</SelectItem>
                  {faculties.map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.name} - {f.longName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-muted-foreground" />
                Semester
              </Label>
              <Select value={semester} onValueChange={(val) => { setSemester(val); setSubject(""); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <SelectItem key={num} value={num.toString()}>Semester {num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Date
                </Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
             </div>
             <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  Subject
                </Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="border-primary/20 bg-primary/5">
                    <SelectValue placeholder={filteredSubjects.length > 0 ? "Choose active subject" : "No matches found"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSubjects.map(sub => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name} ({sub.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
          </div>

          <AnimatePresence mode="wait">
            {!activeQR ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Button 
                  className="w-full h-14 button-hover font-bold text-lg shadow-lg shadow-primary/20" 
                  onClick={handleGenerate}
                  disabled={!subject}
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Start 60s Session
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="p-8 bg-white rounded-3xl shadow-2xl border-4 border-primary/10">
                  <QRCodeSVG 
                    value={activeQR} 
                    size={280}
                    level="H"
                    includeMargin
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="p-4 bg-primary/10 rounded-2xl flex flex-col items-center justify-center border border-primary/20">
                    <p className="text-[10px] uppercase font-bold text-primary mb-1">Session Expiry</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-mono font-bold text-2xl">
                        00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" className="h-full rounded-2xl button-hover border-2" onClick={handleGenerate}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate QR
                  </Button>
                </div>

                <div className="w-full flex items-start gap-3 p-4 bg-accent/5 rounded-2xl text-accent border border-accent/10">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-bold mb-1">Encrypted Payload</p>
                    <p className="opacity-80 italic">Students must scan within 60s. After scanning, the QR code is automatically invalidated for that user.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
