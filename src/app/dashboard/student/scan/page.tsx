
"use client";

import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Scan, Wifi, ShieldOff, Camera, RefreshCw, AlertCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { getCurrentUser, recordScanAttendance } from "@/lib/auth-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StudentScannerPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isInitializingRef = useRef(false);
  const { toast } = useToast();

  const playSound = (type: 'success' | 'error') => {
    const audio = new Audio(type === 'success' ? '/success.mp3' : '/error.mp3');
    audio.play().catch(() => {}); // Ignore if audio fails to play
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
      } catch (err) {
        console.error("Stop Error", err);
      } finally {
        setScanning(false);
        html5QrCodeRef.current = null;
      }
    }
  };

  const startScanner = async () => {
    if (isInitializingRef.current) return;
    isInitializingRef.current = true;
    setLoading(true);
    
    try {
      await stopScanner();
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const html5QrCode = new Html5Qrcode("reader");
      html5QrCodeRef.current = html5QrCode;

      const config = { 
        fps: 30, 
        qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          return { width: Math.floor(minEdge * 0.75), height: Math.floor(minEdge * 0.75) };
        },
        aspectRatio: 1.0,
      };

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        () => {}
      );
      
      setScanning(true);
      setHasCameraPermission(true);
    } catch (err) {
      setHasCameraPermission(false);
      toast({ variant: 'destructive', title: 'Camera Error', description: 'Could not access camera hardware.' });
    } finally {
      setLoading(false);
      isInitializingRef.current = false;
    }
  };

  useEffect(() => {
    startScanner();
    return () => { stopScanner(); };
  }, []);

  const handleScanSuccess = async (decodedText: string) => {
    if (!html5QrCodeRef.current?.isScanning) return;
    
    setLoading(true);
    try {
      const qrData = JSON.parse(decodedText);
      const user = getCurrentUser();

      if (!user) throw new Error("No active session.");

      // Security Checks
      // 1. Semester/Faculty Match
      if (user.faculty !== qrData.faculty || user.semester !== qrData.semester) {
        playSound('error');
        toast({
          variant: "destructive",
          title: "Validation Failed",
          description: `This session is for ${qrData.faculty} Sem ${qrData.semester}. You are enrolled in ${user.faculty} Sem ${user.semester}.`,
        });
        return;
      }

      // 2. Time/Token Check
      const result = recordScanAttendance({
        studentId: user.id,
        studentName: user.name,
        subjectId: qrData.subjectId,
        subjectName: qrData.subject,
        faculty: qrData.faculty,
        semester: qrData.semester,
        token: qrData.token
      });

      if (result.success) {
        playSound('success');
        await stopScanner();
        setScanResult(qrData);
        toast({ title: "Verified", description: result.message });
      } else {
        playSound('error');
        toast({ variant: "destructive", title: "Verification Failed", description: result.message });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Invalid Data", description: "This QR code is not compatible with EduScan." });
    } finally {
      setLoading(false);
    }
  };

  const handleManualEntry = () => {
    if (!manualCode) return;
    toast({ title: "Processing...", description: "Manual tokens require admin verification." });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      <div className="text-center">
        <h1 className="text-2xl font-headline font-bold text-primary">Attendance Scanner</h1>
        <p className="text-muted-foreground text-xs">Verify your identity for today's session</p>
      </div>

      <AnimatePresence mode="wait">
        {!scanResult ? (
          <motion.div key="scanner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Card className="border-none shadow-2xl overflow-hidden bg-black aspect-square rounded-[2rem] relative">
              <div id="reader" className="w-full h-full [&_video]:object-cover"></div>
              
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                <div className="w-[75%] h-[75%] border-2 border-white/20 rounded-[2rem] relative overflow-hidden">
                  <motion.div 
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.8)] z-20"
                  />
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                </div>
              </div>

              {loading && (
                <div className="absolute inset-0 bg-black/60 z-20 flex flex-col items-center justify-center text-white backdrop-blur-md">
                  <RefreshCw className="w-12 h-12 text-primary animate-spin mb-4" />
                  <p className="text-sm font-bold tracking-widest uppercase">Validating Session...</p>
                </div>
              )}
            </Card>

            <Card className="border-none shadow-sm p-6 bg-white">
               <Label className="text-xs font-bold uppercase tracking-wider mb-2 block">Manual Entry Option</Label>
               <div className="flex gap-2">
                 <Input 
                   placeholder="Enter Session Token" 
                   value={manualCode} 
                   onChange={(e) => setManualCode(e.target.value)} 
                   className="h-11"
                 />
                 <Button onClick={handleManualEntry} variant="secondary" className="px-6 h-11">Verify</Button>
               </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
            <Card className="rounded-[3rem] shadow-2xl p-10 border-none bg-white">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg mx-auto mb-8">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-headline font-bold text-green-600 mb-2">Registered Successfully!</h2>
              <p className="text-muted-foreground mb-8">Attendance recorded for {scanResult.subject}.</p>
              
              <div className="bg-muted/50 rounded-3xl p-6 text-left space-y-4 mb-8">
                <div>
                   <p className="text-[10px] font-bold uppercase text-muted-foreground">Session Token</p>
                   <p className="font-mono text-xs truncate">{scanResult.token}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Time</p>
                    <p className="text-sm font-bold">{new Date().toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Status</p>
                    <p className="text-sm font-bold text-green-600">PRESENT</p>
                  </div>
                </div>
              </div>

              <Button className="w-full h-14 rounded-2xl font-bold" onClick={() => setScanResult(null)}>
                Finish & Close
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
