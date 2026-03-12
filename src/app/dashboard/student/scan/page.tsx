
"use client";

import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, Scan, Wifi, ShieldOff, Camera, RefreshCw, XCircle } from "lucide-react";
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

  const startScanner = async () => {
    try {
      const html5QrCode = new Html5Qrcode("reader");
      html5QrCodeRef.current = html5QrCode;

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // ignore scan errors
        }
      );
      setScanning(true);
      setHasCameraPermission(true);
    } catch (err) {
      console.error("Scanner Error", err);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Error',
        description: 'Could not access camera. Please ensure permissions are granted.',
      });
    }
  };

  useEffect(() => {
    startScanner();
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(e => console.error(e));
      }
    };
  }, []);

  const handleScanSuccess = async (decodedText: string) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const qrData = JSON.parse(decodedText);
      const user = getCurrentUser();

      if (!user || user.role !== 'Student') {
        throw new Error("Invalid student session.");
      }

      // Record the attendance in the global store
      const success = recordScanAttendance({
        studentId: user.id,
        studentName: user.name,
        subjectId: qrData.subjectId || qrData.id, // Support different QR versions
        subjectName: qrData.subject,
        faculty: qrData.faculty,
        semester: qrData.semester || user.semester || 1
      });

      if (success) {
        setScanResult(qrData);
        toast({
          title: "Attendance Marked",
          description: `Successfully checked in for ${qrData.subject}.`,
        });
        
        // Stop the camera once successful
        if (html5QrCodeRef.current) {
          await html5QrCodeRef.current.stop();
          setScanning(false);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Already Recorded",
          description: "You have already marked attendance for this class today.",
        });
      }
    } catch (e) {
      console.error("Scan processing error", e);
      toast({
        variant: "destructive",
        title: "Invalid QR Code",
        description: "This QR code is not compatible with EduScan.",
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
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Scan className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-primary">Attendance Scanner</h1>
        </div>
        <Button 
          variant={wifiBypass ? "outline" : "destructive"} 
          size="sm" 
          onClick={() => setWifiBypass(!wifiBypass)}
          className="text-[10px] uppercase font-bold tracking-widest"
        >
          {wifiBypass ? <ShieldOff className="w-3 h-3 mr-1" /> : <Wifi className="w-3 h-3 mr-1" />}
          WiFi Detection: {wifiBypass ? "OFF" : "ON"}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {!scanResult ? (
          <motion.div
            key="scanner"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <Card className="border-none shadow-sm overflow-hidden bg-black relative">
              <CardHeader className="bg-white border-b relative z-20">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Real-Time Camera</CardTitle>
                    <CardDescription>Point camera at the teacher's QR code</CardDescription>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${wifiBypass ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                    {wifiBypass ? <ShieldOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
                    {wifiBypass ? 'Manual Mode' : 'Connected'}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 min-h-[450px] flex items-center justify-center relative">
                <div id="reader" className="w-full h-full min-h-[450px] [&_video]:object-cover [&_video]:h-[450px]"></div>
                
                {hasCameraPermission === false && (
                  <div className="absolute inset-0 z-50 p-6 flex items-center justify-center bg-background/95 backdrop-blur-sm">
                    <Alert variant="destructive" className="max-w-sm">
                      <Camera className="h-4 w-4" />
                      <AlertTitle>Camera Access Required</AlertTitle>
                      <AlertDescription>
                        Real-time attendance requires camera access. Please update your browser settings.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {loading && (
                  <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center text-white">
                    <RefreshCw className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="font-bold tracking-widest uppercase text-sm">Validating Scan...</p>
                  </div>
                )}

                {/* Overlays for scanner effect */}
                <div className="absolute inset-0 pointer-events-none z-10">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-primary/50 rounded-2xl">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                    {scanning && (
                      <motion.div 
                        animate={{ top: ["10%", "90%", "10%"] }} 
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_15px_rgba(46,92,184,0.8)]"
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
            <div className="p-12 bg-white rounded-3xl shadow-xl flex flex-col items-center gap-6 border border-primary/5">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-inner">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl font-headline font-bold text-foreground">Attendance Marked!</h2>
                <p className="text-muted-foreground mt-1 font-medium italic">Verified for {scanResult.subject}</p>
              </div>
              <div className="w-full max-w-sm grid grid-cols-2 gap-4 text-left border-t border-dashed pt-8">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Session ID</p>
                  <p className="font-semibold text-primary truncate max-w-[150px]">{scanResult.subjectId || scanResult.id}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Scan Time</p>
                  <p className="font-semibold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <Button className="w-full button-hover h-14 font-bold text-lg" onClick={resetScanner}>
                Scan Next Class
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-5 bg-muted/40 rounded-xl border border-muted flex items-start gap-4">
        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
          <Scan className="w-5 h-5 text-primary" />
        </div>
        <div className="text-sm">
          <p className="font-bold text-foreground mb-1">Live Synchronization</p>
          <p className="text-muted-foreground leading-relaxed">
            Your attendance is being synced with the teacher's record database in real-time. Do not close the app until you see the confirmation screen.
          </p>
        </div>
      </div>
    </div>
  );
}
