
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
      // Wait for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const html5QrCode = new Html5Qrcode("reader");
      html5QrCodeRef.current = html5QrCode;

      // Higher FPS and better box sizing for faster response
      const config = { 
        fps: 25, 
        qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          const boxSize = Math.floor(minEdge * 0.7);
          return { width: boxSize, height: boxSize };
        },
        aspectRatio: 1.0
      };

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        () => {
          // Scanning in progress...
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
        description: 'Ensure you have allowed camera access in your browser settings.',
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
    if (!scanning) return;
    
    setLoading(true);
    setScanning(false);
    
    try {
      await stopScanner();
      
      const qrData = JSON.parse(decodedText);
      const user = getCurrentUser();

      if (!user || user.role !== 'Student') {
        throw new Error("Invalid student session.");
      }

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
          description: "You have already marked attendance for this session today.",
        });
        startScanner();
      }
    } catch (e) {
      console.error("Invalid QR", e);
      toast({
        variant: "destructive",
        title: "Scan Failed",
        description: "The QR code is invalid or the session has expired.",
      });
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
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-2xl font-headline font-bold text-primary">Attendance Scan</h1>
          <p className="text-muted-foreground text-xs">Align the QR code within the frame</p>
        </div>
        <Button 
          variant={wifiBypass ? "outline" : "destructive"} 
          size="sm" 
          onClick={() => setWifiBypass(!wifiBypass)}
          className="text-[10px] h-8"
        >
          Net Check: {wifiBypass ? "OFF" : "ON"}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {!scanResult ? (
          <motion.div
            key="scanner-view"
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
              
              {/* Responsive Alignment UI */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                <div className="w-2/3 h-2/3 border-2 border-white/30 rounded-3xl relative">
                  <motion.div 
                    animate={{ top: ["5%", "95%", "5%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_20px_rgba(var(--primary),1)]"
                  />
                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />
                </div>
              </div>

              {loading && (
                <div className="absolute inset-0 bg-black/60 z-20 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                  <RefreshCw className="w-10 h-10 text-primary animate-spin mb-3" />
                  <p className="text-xs font-bold tracking-widest uppercase text-primary">Analyzing...</p>
                </div>
              )}

              {hasCameraPermission === false && (
                <div className="absolute inset-0 z-30 p-6 flex items-center justify-center bg-background/95">
                  <Alert variant="destructive">
                    <Camera className="h-4 w-4" />
                    <AlertTitle>Camera Required</AlertTitle>
                    <AlertDescription className="mt-2">
                      Please allow camera access to use the attendance scanner.
                      <Button onClick={startScanner} variant="outline" className="w-full mt-4">Retry</Button>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="success-view"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-2"
          >
            <div className="bg-white rounded-[2.5rem] shadow-xl p-8 text-center border-4 border-green-500/10">
              <div className="relative inline-block mb-6">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 bg-green-500 rounded-full -z-10"
                />
              </div>

              <h2 className="text-3xl font-headline font-bold text-green-600 mb-2">Success!</h2>
              <p className="text-muted-foreground font-medium mb-6">Attendance Registered for:</p>
              
              <div className="bg-primary/5 rounded-2xl p-6 mb-8 text-left border border-primary/10">
                <p className="text-2xl font-bold text-primary mb-4">{scanResult.subject}</p>
                <div className="grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-widest opacity-70">
                  <div>
                    <p className="text-muted-foreground mb-1">Faculty</p>
                    <p className="text-foreground">{scanResult.faculty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground mb-1">Semester</p>
                    <p className="text-foreground">{scanResult.semester}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button className="w-full h-14 rounded-2xl font-bold text-lg" onClick={resetScanner}>
                  Scan Another
                </Button>
                <Button variant="ghost" onClick={() => window.location.href = '/dashboard'}>
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 bg-muted/40 rounded-2xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-muted-foreground">
          <p className="font-bold text-foreground mb-1">How to scan properly:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Keep the phone steady and about 8-12 inches away.</li>
            <li>Ensure the teacher's screen is clear and bright.</li>
            <li>Wait for the green confirmation screen.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
