
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
        // Silent catch for already stopped scanner
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
      // Brief delay to ensure hardware release and DOM availability
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const html5QrCode = new Html5Qrcode("reader");
      html5QrCodeRef.current = html5QrCode;

      // Higher FPS and larger viewfinder box for better distance scanning
      const config = { 
        fps: 20, 
        qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          // Large scanning area (80% of width) to catch QR from far away
          const boxSize = Math.floor(minEdge * 0.8);
          return { width: boxSize, height: boxSize };
        },
        aspectRatio: 1.0,
        disableFlip: false
      };

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        () => {
          // Scanner is running...
        }
      );
      
      setScanning(true);
      setHasCameraPermission(true);
    } catch (err) {
      console.error("Scanner Error", err);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions to scan attendance QR codes.',
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
    // Prevent multiple success calls
    if (!html5QrCodeRef.current?.isScanning) return;
    
    setLoading(true);
    
    try {
      // Decode the teacher's QR payload
      const qrData = JSON.parse(decodedText);
      const user = getCurrentUser();

      if (!user || user.role !== 'Student') {
        throw new Error("Invalid session.");
      }

      // Record in local persistent storage
      const success = recordScanAttendance({
        studentId: user.id,
        studentName: user.name,
        subjectId: qrData.subjectId || qrData.id,
        subjectName: qrData.subject,
        faculty: qrData.faculty,
        semester: qrData.semester || user.semester || 1
      });

      if (success) {
        // Stop hardware immediately on success
        await stopScanner();
        setScanResult(qrData);
        toast({
          title: "Attendance Verified",
          description: `Checked in for ${qrData.subject} successfully.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Duplicate Entry",
          description: "You have already marked attendance for this session today.",
        });
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Scan Error",
        description: "Invalid QR code format. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    startScanner();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-2xl font-headline font-bold text-primary">Live QR Scan</h1>
          <p className="text-muted-foreground text-xs">Align the code within the targeting frame</p>
        </div>
        <Button 
          variant={wifiBypass ? "outline" : "destructive"} 
          size="sm" 
          onClick={() => setWifiBypass(!wifiBypass)}
          className="text-[10px] h-8"
        >
          Wifi Check: {wifiBypass ? "OFF" : "ON"}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {!scanResult ? (
          <motion.div
            key="scanner-active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <Card className="border-none shadow-2xl overflow-hidden bg-black aspect-square rounded-[2rem] relative">
              <div 
                id="reader" 
                className="w-full h-full [&_video]:object-cover"
              ></div>
              
              {/* Target UI Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                <div className="w-[85%] h-[85%] border-2 border-white/20 rounded-[2.5rem] relative overflow-hidden">
                  {/* Laser Line Animation */}
                  <motion.div 
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-primary/80 shadow-[0_0_15px_rgba(var(--primary),0.8)] z-20"
                  />
                  {/* Corner Visuals */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                </div>
              </div>

              {loading && (
                <div className="absolute inset-0 bg-black/60 z-20 flex flex-col items-center justify-center text-white backdrop-blur-md">
                  <RefreshCw className="w-12 h-12 text-primary animate-spin mb-4" />
                  <p className="text-sm font-bold tracking-widest uppercase text-primary">Validating Data...</p>
                </div>
              )}

              {hasCameraPermission === false && (
                <div className="absolute inset-0 z-30 p-8 flex items-center justify-center bg-background/95">
                  <Alert variant="destructive">
                    <Camera className="h-5 w-5" />
                    <AlertTitle className="font-bold">Camera Access Required</AlertTitle>
                    <AlertDescription className="mt-2">
                      Please allow camera access in your browser settings to continue.
                      <Button onClick={startScanner} variant="outline" className="w-full mt-6 h-12 font-bold">Retry Camera</Button>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="scan-success"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-2"
          >
            <div className="bg-white rounded-[3rem] shadow-2xl p-10 text-center border-4 border-green-500/5">
              <div className="relative inline-block mb-8">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-green-500 rounded-full -z-10"
                />
              </div>

              <h2 className="text-4xl font-headline font-bold text-green-600 mb-3">Attendance Registered!</h2>
              <p className="text-muted-foreground font-medium mb-8">Successfully recorded for this session.</p>
              
              <div className="bg-primary/5 rounded-3xl p-8 mb-10 text-left border border-primary/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Subject Verified</p>
                <p className="text-2xl font-bold text-foreground mb-6 leading-tight">{scanResult.subject}</p>
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-primary/10">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Faculty</p>
                    <p className="text-sm font-bold">{scanResult.faculty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Semester</p>
                    <p className="text-sm font-bold">Sem {scanResult.semester}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button className="w-full h-14 rounded-2xl font-bold text-lg button-hover shadow-xl shadow-primary/10" onClick={resetScanner}>
                  Scan Another Class
                </Button>
                <Button variant="ghost" className="h-12" onClick={() => window.location.href = '/dashboard'}>
                  Return to Dashboard
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-5 bg-muted/40 rounded-3xl flex items-start gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <AlertCircle className="w-5 h-5 text-primary" />
        </div>
        <div className="text-xs leading-relaxed text-muted-foreground">
          <p className="font-bold text-foreground mb-1">Scanning Tips:</p>
          <ul className="list-disc list-inside space-y-1 opacity-80">
            <li>Hold the phone parallel to the screen.</li>
            <li>Keep the code within the large targeting box.</li>
            <li>Scanning works from up to 2-3 feet away.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
