
"use client";

import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Scan, RefreshCw, AlertCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
    try {
      const audio = new Audio(type === 'success' ? 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' : 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
      audio.play().catch(() => {});
    } catch (e) {}
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
        fps: 20, 
        qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          return { width: Math.floor(minEdge * 0.8), height: Math.floor(minEdge * 0.8) };
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
    if (loading) return;
    
    setLoading(true);
    try {
      const qrData = JSON.parse(decodedText);
      const user = getCurrentUser();

      if (!user) {
        toast({ variant: "destructive", title: "Error", description: "No active session." });
        return;
      }

      // Security Checks: Semester/Faculty Match (handling string/number types)
      if (user.faculty !== qrData.faculty || user.semester?.toString() !== qrData.semester?.toString()) {
        playSound('error');
        toast({
          variant: "destructive",
          title: "Validation Failed",
          description: `This QR is for ${qrData.faculty} Sem ${qrData.semester}. You are in ${user.faculty} Sem ${user.semester}.`,
        });
        setLoading(false);
        return;
      }

      const result = recordScanAttendance({
        studentId: user.id,
        studentName: user.name,
        subjectId: qrData.subjectId,
        subjectName: qrData.subject,
        faculty: qrData.faculty,
        semester: parseInt(qrData.semester),
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
      playSound('error');
      toast({ variant: "destructive", title: "Invalid QR", description: "This code is not compatible with EduScan." });
    } finally {
      setLoading(false);
    }
  };

  const handleManualEntry = () => {
    if (!manualCode) return;
    handleScanSuccess(JSON.stringify({ token: manualCode, subject: "Manual Entry", subjectId: "MANUAL" }));
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      <div className="text-center">
        <h1 className="text-2xl font-headline font-bold text-primary">Attendance Scanner</h1>
        <p className="text-muted-foreground text-xs">Point your camera at the teacher's QR code</p>
      </div>

      <AnimatePresence mode="wait">
        {!scanResult ? (
          <motion.div key="scanner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Card className="border-none shadow-2xl overflow-hidden bg-black aspect-square rounded-[2rem] relative">
              <div id="reader" className="w-full h-full [&_video]:object-cover"></div>
              
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                <div className="w-[80%] h-[80%] border-2 border-white/20 rounded-[2rem] relative overflow-hidden">
                  <motion.div 
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.8)] z-20"
                  />
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                </div>
              </div>

              {loading && (
                <div className="absolute inset-0 bg-black/60 z-20 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                  <RefreshCw className="w-10 h-10 text-primary animate-spin mb-4" />
                  <p className="text-xs font-bold tracking-widest uppercase">Verifying...</p>
                </div>
              )}
            </Card>

            <Card className="border-none shadow-sm p-6 bg-white">
               <Label className="text-xs font-bold uppercase tracking-wider mb-2 block">Manual Token Entry</Label>
               <div className="flex gap-2">
                 <Input 
                   placeholder="Enter code from teacher" 
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
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-headline font-bold text-green-600 mb-2">Registered!</h2>
              <p className="text-muted-foreground text-sm mb-8">Your attendance has been recorded.</p>
              
              <div className="bg-muted/50 rounded-2xl p-5 text-left space-y-3 mb-8">
                <div>
                   <p className="text-[10px] font-bold uppercase text-muted-foreground">Subject</p>
                   <p className="font-bold text-sm">{scanResult.subject}</p>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Time</p>
                    <p className="text-xs font-bold">{new Date().toLocaleTimeString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Status</p>
                    <p className="text-xs font-bold text-green-600">PRESENT</p>
                  </div>
                </div>
              </div>

              <Button className="w-full h-12 rounded-xl font-bold" onClick={() => { setScanResult(null); startScanner(); }}>
                Scan Another
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
