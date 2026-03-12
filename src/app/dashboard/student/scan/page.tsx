
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
      }
    }
  };

  const startScanner = async () => {
    setLoading(true);
    try {
      // Small delay to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 300));
      
      await stopScanner();
      
      const html5QrCode = new Html5Qrcode("reader");
      html5QrCodeRef.current = html5QrCode;

      const config = { 
        fps: 15, 
        qrbox: { width: 280, height: 280 },
        aspectRatio: 1.0
      };

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Scanning... no error feedback needed for frame misses
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
    }
  };

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, []);

  const handleScanSuccess = async (decodedText: string) => {
    if (loading || !scanning) return;
    
    setLoading(true);
    setScanning(false); // Stop processing more frames immediately
    
    try {
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
          description: `Checked in for ${qrData.subject} at ${new Date().toLocaleTimeString()}.`,
        });
        await stopScanner();
      } else {
        // Resume scanning if it was just a duplicate or failed record
        toast({
          variant: "destructive",
          title: "Duplicate Scan",
          description: "Attendance for this session has already been recorded today.",
        });
        setScanning(true);
      }
    } catch (e) {
      console.error("Invalid QR", e);
      toast({
        variant: "destructive",
        title: "Incompatible QR Code",
        description: "Please scan a valid EduScan session code from your teacher.",
      });
      setScanning(true);
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
            <h1 className="text-3xl font-headline font-bold text-primary">Live Scan</h1>
            <p className="text-muted-foreground text-sm">Real-time attendance capture</p>
          </div>
        </div>
        <Button 
          variant={wifiBypass ? "outline" : "destructive"} 
          size="sm" 
          onClick={() => setWifiBypass(!wifiBypass)}
          className="text-[10px] uppercase font-bold tracking-widest h-8"
        >
          {wifiBypass ? <ShieldOff className="w-3 h-3 mr-1" /> : <Wifi className="w-3 h-3 mr-1" />}
          Network Check: {wifiBypass ? "OFF" : "ON"}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {!scanResult ? (
          <motion.div
            key="scanner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            <Card className="border-none shadow-2xl overflow-hidden bg-black relative rounded-3xl">
              <CardHeader className="bg-white/95 backdrop-blur-md border-b relative z-20">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      Active Camera
                      {scanning && (
                        <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      )}
                    </CardTitle>
                    <CardDescription>Align QR code within the target box</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0 min-h-[500px] flex items-center justify-center relative">
                <div 
                  id="reader" 
                  className="w-full h-full min-h-[500px] [&_video]:object-cover [&_video]:h-[500px] [&_video]:w-full"
                ></div>
                
                {hasCameraPermission === false && !loading && (
                  <div className="absolute inset-0 z-50 p-6 flex items-center justify-center bg-background/95 backdrop-blur-sm">
                    <Alert variant="destructive" className="max-w-sm">
                      <Camera className="h-4 w-4" />
                      <AlertTitle>Camera Access Required</AlertTitle>
                      <AlertDescription className="space-y-4">
                        <p>We need your camera to verify your attendance. Please check your browser permissions.</p>
                        <Button onClick={startScanner} variant="outline" className="w-full">
                          Try Again
                        </Button>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {loading && (
                  <div className="absolute inset-0 bg-black/70 z-50 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                    <RefreshCw className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="font-bold tracking-widest uppercase text-xs">Connecting Camera...</p>
                  </div>
                )}

                {/* Scanning Interface Overlays */}
                <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                  <div className="w-72 h-72 border-2 border-white/20 rounded-3xl relative">
                    {/* Corner Borders */}
                    <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-2xl -translate-x-1 -translate-y-1"></div>
                    <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-2xl translate-x-1 -translate-y-1"></div>
                    <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-2xl -translate-x-1 translate-y-1"></div>
                    <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-2xl translate-x-1 translate-y-1"></div>
                    
                    {/* Laser Line Animation */}
                    {scanning && (
                      <motion.div 
                        animate={{ top: ["5%", "95%", "5%"] }} 
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-2 right-2 h-0.5 bg-primary/80 shadow-[0_0_20px_rgba(46,92,184,1)] z-20"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-6"
          >
            <div className="p-12 bg-white rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-8 border border-primary/5">
              <div className="relative">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-28 h-28 bg-green-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl"
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-green-500/20 rounded-full -z-10"
                />
              </div>

              <div className="space-y-2">
                <h2 className="text-4xl font-headline font-bold text-foreground">Verified!</h2>
                <p className="text-muted-foreground font-medium text-lg">{scanResult.subject}</p>
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
                <div className="space-y-1 pt-4 border-t border-muted col-span-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold text-center">Reference ID</p>
                  <p className="font-mono text-[10px] text-center text-primary truncate">{scanResult.id}</p>
                </div>
              </div>

              <Button className="w-full button-hover h-16 rounded-2xl font-bold text-xl shadow-xl shadow-primary/20" onClick={resetScanner}>
                Scan Another Class
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-start gap-5">
        <div className="p-3 bg-primary/10 rounded-2xl shrink-0">
          <AlertCircle className="w-6 h-6 text-primary" />
        </div>
        <div className="text-sm">
          <p className="font-bold text-primary mb-1 text-base">Direct Sync Active</p>
          <p className="text-muted-foreground leading-relaxed">
            Your attendance record is instantly transmitted to the college database. Ensure you see the <strong>"Verified!"</strong> screen before leaving the scanning area.
          </p>
        </div>
      </div>
    </div>
  );
}
