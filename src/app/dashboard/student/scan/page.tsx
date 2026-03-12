
"use client";

import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Scan, Wifi, ShieldOff, Camera, RefreshCw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { getCurrentUser, recordScanAttendance } from "@/lib/auth-store";

export default function StudentScannerPage() {
  const [wifiBypass, setWifiBypass] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isInitializingRef = useRef(false);
  const { toast } = useToast();

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
      } catch (err) {
        console.warn("Scanner stop warning:", err);
      } finally {
        setScanning(false);
        // Clear reference completely
        html5QrCodeRef.current = null;
      }
    }
  };

  const startScanner = async () => {
    if (isInitializingRef.current) return;
    isInitializingRef.current = true;
    setLoading(true);
    
    try {
      // Small delay to ensure previous instance is fully gone
      await stopScanner();
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const html5QrCode = new Html5Qrcode("reader");
      html5QrCodeRef.current = html5QrCode;

      const config = { 
        fps: 20, // Higher FPS for smoother scanning
        qrbox: { width: 280, height: 280 }, // Slightly larger box
        aspectRatio: 1.0
      };

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        () => {
          // Scanning...
        }
      );
      
      setScanning(true);
      setHasCameraPermission(true);
    } catch (err) {
      console.error("Scanner Error", err);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Connection Failed',
        description: 'Ensure you have allowed camera access and no other app is using it.',
      });
    } finally {
      setLoading(false);
      isInitializingRef.current = false;
    }
  };

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, []);

  const handleScanSuccess = async (decodedText: string) => {
    // Only process one scan at a time
    if (!scanning) return;
    
    setLoading(true);
    setScanning(false);
    
    try {
      // Ensure the scanner stops immediately upon success
      await stopScanner();
      
      const qrData = JSON.parse(decodedText);
      const user = getCurrentUser();

      if (!user || user.role !== 'Student') {
        throw new Error("Invalid student session.");
      }

      // Record the attendance in the shared data store
      const success = recordScanAttendance({
        studentId: user.id,
        studentName: user.name,
        subjectId: qrData.subjectId || qrData.id,
        subjectName: qrData.subject,
        faculty: qrData.faculty,
        semester: qrData.semester || user.semester || 1
      });

      if (success) {
        setScanResult(qrData);
        toast({
          title: "Attendance Verified",
          description: `Checked in for ${qrData.subject} successfully.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Duplicate Scan",
          description: "Attendance for this session has already been recorded today.",
        });
        // Restart if it was a duplicate
        startScanner();
      }
    } catch (e) {
      console.error("Invalid QR", e);
      toast({
        variant: "destructive",
        title: "Incompatible QR Code",
        description: "Please scan a valid session QR from your teacher.",
      });
      // Restart scanner for next attempt
      startScanner();
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    startScanner();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Scan className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-headline font-bold text-primary">Attendance Scan</h1>
            <p className="text-muted-foreground text-sm">Align the teacher's QR code</p>
          </div>
        </div>
        <Button 
          variant={wifiBypass ? "outline" : "destructive"} 
          size="sm" 
          onClick={() => setWifiBypass(!wifiBypass)}
          className="text-[10px] uppercase font-bold tracking-widest h-8"
        >
          {wifiBypass ? <ShieldOff className="w-3 h-3 mr-1" /> : <Wifi className="w-3 h-3 mr-1" />}
          Net Check: {wifiBypass ? "OFF" : "ON"}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {!scanResult ? (
          <motion.div
            key="scanner"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            <Card className="border-none shadow-2xl overflow-hidden bg-black relative rounded-3xl min-h-[400px]">
              <div 
                id="reader" 
                className="w-full min-h-[400px] [&_video]:object-cover"
              ></div>
              
              {/* Custom Laser Overlay for Alignment */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[280px] h-[280px] border-2 border-white/50 rounded-3xl relative overflow-hidden">
                  <motion.div 
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.8)]"
                  />
                </div>
              </div>

              <AnimatePresence>
                {loading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/70 z-50 flex flex-col items-center justify-center text-white backdrop-blur-sm"
                  >
                    <RefreshCw className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="font-bold tracking-widest uppercase text-xs text-primary">Processing...</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {hasCameraPermission === false && !loading && (
                <div className="absolute inset-0 z-50 p-6 flex items-center justify-center bg-background/95 backdrop-blur-sm">
                  <Alert variant="destructive" className="max-w-sm">
                    <Camera className="h-4 w-4" />
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription className="space-y-4">
                      <p>Please check your browser permissions to use the scanner.</p>
                      <Button onClick={startScanner} variant="outline" className="w-full">
                        Try Again
                      </Button>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-6"
          >
            <div className="p-12 bg-white rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-8 border-4 border-green-500/20">
              <div className="relative">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-xl"
                >
                  <CheckCircle2 className="w-16 h-16 text-white" />
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-green-500/30 rounded-full -z-10"
                />
              </div>

              <div className="space-y-2">
                <h2 className="text-4xl font-headline font-bold text-green-600">Successfully Scanned!</h2>
                <p className="text-muted-foreground font-medium text-lg">Attendance Registered for:</p>
                <p className="text-2xl font-bold text-primary px-4 py-2 bg-primary/5 rounded-xl">{scanResult.subject}</p>
              </div>

              <div className="w-full max-w-sm bg-muted/30 rounded-2xl p-6 grid grid-cols-2 gap-6 text-left border border-muted">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Faculty</p>
                  <p className="font-bold text-sm">{scanResult.faculty}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Semester</p>
                  <p className="font-bold text-sm">{scanResult.semester}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full">
                <Button className="w-full button-hover h-16 rounded-2xl font-bold text-xl shadow-xl shadow-primary/20" onClick={resetScanner}>
                  Scan Another Class
                </Button>
                <Button variant="ghost" onClick={() => window.location.href = '/dashboard'} className="text-muted-foreground">
                  Go back to Dashboard
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-start gap-5">
        <div className="p-3 bg-primary/10 rounded-2xl shrink-0">
          <AlertCircle className="w-6 h-6 text-primary" />
        </div>
        <div className="text-sm">
          <p className="font-bold text-primary mb-1 text-base">Scanning Tips</p>
          <ul className="text-muted-foreground list-disc list-inside space-y-1">
            <li>Hold the phone steady about 6-10 inches from the QR.</li>
            <li>Ensure the teacher's screen brightness is up.</li>
            <li>Align the QR within the targeting frame.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
