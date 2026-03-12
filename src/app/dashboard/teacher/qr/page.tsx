
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { QrCode, RefreshCw, Clock, AlertCircle, GraduationCap, BookOpen, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MOCK_SUBJECTS = [
  { id: "BIT-DBS", name: "Database Systems", faculty: "BIT", semester: "5" },
  { id: "BIT-OOP", name: "Object Oriented Programming", faculty: "BIT", semester: "3" },
  { id: "BIT-CC", name: "Cloud Computing", faculty: "BIT", semester: "7" },
  { id: "BBA-MKT", name: "Marketing Management", faculty: "BBA", semester: "4" },
  { id: "BBA-ACC", name: "Financial Accounting", faculty: "BBA", semester: "2" },
  { id: "BHM-FNB", name: "Food & Beverage", faculty: "BHM", semester: "1" },
];

export default function GenerateQRPage() {
  const [faculty, setFaculty] = useState<string>("BIT");
  const [semester, setSemester] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [activeQR, setActiveQR] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const { toast } = useToast();

  const filteredSubjects = MOCK_SUBJECTS.filter(s => {
    const facultyMatch = faculty === "all" || s.faculty === faculty;
    const semesterMatch = !semester || semester === "all" || s.semester === semester;
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
    const selectedSub = MOCK_SUBJECTS.find(s => s.id === subject);
    const uniqueId = JSON.stringify({
      id: `ATT-${subject}-${Date.now()}`,
      subjectId: selectedSub?.id,
      subject: selectedSub?.name,
      faculty: selectedSub?.faculty,
      semester: parseInt(selectedSub?.semester || "1"),
      timestamp: new Date().toISOString()
    });
    
    setActiveQR(uniqueId);
    setTimeLeft(60);
    toast({ 
      title: "QR Generated", 
      description: `Attendance session started for ${selectedSub?.name}.` 
    });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeQR && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setActiveQR(null);
      toast({ title: "QR Expired", description: "The session has timed out. Please generate a new one." });
    }
    return () => clearInterval(timer);
  }, [activeQR, timeLeft, toast]);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <QrCode className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Attendance QR</h1>
          <p className="text-muted-foreground">Set up your classroom session</p>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Session Configuration</CardTitle>
          <CardDescription>Filter by faculty and semester to find your subject</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                Faculty
              </Label>
              <Select value={faculty} onValueChange={(val) => {
                setFaculty(val);
                setSubject("");
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Faculty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Faculties</SelectItem>
                  <SelectItem value="BIT">BIT (Information Tech)</SelectItem>
                  <SelectItem value="BBA">BBA (Business Admin)</SelectItem>
                  <SelectItem value="BHM">BHM (Hotel Management)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-muted-foreground" />
                Semester
              </Label>
              <Select value={semester} onValueChange={(val) => {
                setSemester(val);
                setSubject("");
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Semesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <SelectItem key={num} value={num.toString()}>Semester {num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              Active Subject
            </Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="h-12 border-primary/20 bg-primary/5">
                <SelectValue placeholder={filteredSubjects.length > 0 ? "Select class subject" : "No subjects found for these filters"} />
              </SelectTrigger>
              <SelectContent>
                {filteredSubjects.map(sub => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.name} ({sub.id}) — Sem {sub.semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  Generate Attendance QR
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="p-10 bg-white rounded-3xl shadow-2xl border-8 border-primary/5">
                  <QRCodeSVG 
                    value={activeQR} 
                    size={280}
                    level="H"
                    includeMargin
                    imageSettings={{
                      src: "https://picsum.photos/seed/edu/100/100",
                      x: undefined,
                      y: undefined,
                      height: 40,
                      width: 40,
                      excavate: true,
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="p-4 bg-primary/10 rounded-2xl flex flex-col items-center justify-center border border-primary/20">
                    <p className="text-[10px] uppercase font-bold text-primary mb-1">Time Remaining</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-mono font-bold text-2xl">
                        00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" className="h-full rounded-2xl button-hover border-2" onClick={handleGenerate}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Timer
                  </Button>
                </div>

                <div className="w-full flex items-start gap-3 p-4 bg-accent/5 rounded-2xl text-accent border border-accent/10">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-bold mb-1">Real-Time Sync Active</p>
                    <p className="opacity-80 italic">Student scans are instantly linked to your Attendance Report dashboard.</p>
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
