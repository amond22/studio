
"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, Scan, Wifi, ShieldOff, Camera, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function StudentScannerPage() {
  const [wifiBypass, setWifiBypass] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  // 1. Handle Camera Permission and Initial Stream
  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  // 2. Initialize Scanner when permission is granted
  useEffect(() => {
    if (hasCameraPermission === true && !scanResult) {
      // Small delay to ensure the permission stream is either reused or doesn't lock the resource
      const timer = setTimeout(() => {
        if (!scannerRef.current) {
          const scanner = new Html5QrcodeScanner(
            "reader",
            { 
              fps: 10, 
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0,
              showTorchButtonIfSupported: true,
            },
            /* verbose= */ false
          );

          scanner.render(
            (decodedText) => {
              handleScanSuccess(decodedText);
            },
            (error) => {
              // Silent errors during scanning for better UX
            }
          );

          scannerRef.current = scanner;
        }
      }, 500);

      return () => {
        clearTimeout(timer);
        if (scannerRef.current) {
          scannerRef.current.clear().catch(e => console.error("Scanner cleanup error", e));
          scannerRef.current = null;
        }
      };
    }
  }, [hasCameraPermission, scanResult]);

  const handleScanSuccess = (result: string) => {
    if (scannerRef.current) {
      scannerRef.current.pause();
    }
    setLoading(true);
    
    // Simulate API call for attendance verification
    setTimeout(() => {
      setScanResult(result);
      setLoading(false);
      toast({
        title: "Attendance Recorded",
        description: "✅ Successful scan for Cloud Computing.",
      });
    }, 1200);
  };

  const resetScanner = () => {
    setScanResult(null);
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
            <Card className="border-none shadow-sm overflow-hidden bg-muted/20">
              <CardHeader className="bg-white border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Camera View</CardTitle>
                    <CardDescription>Position the QR code within the frame</CardDescription>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${wifiBypass ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                    {wifiBypass ? <ShieldOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
                    {wifiBypass ? 'Bypass Mode' : 'College WiFi'}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 min-h-[400px] flex items-center justify-center relative bg-black">
                
                {/* Always show video tag irrespective of hasCameraPermission check to prevent race condition */}
                <video 
                  ref={videoRef} 
                  className={`w-full aspect-video rounded-md absolute inset-0 object-cover z-0 ${hasCameraPermission && !loading ? 'opacity-30' : 'opacity-0'}`} 
                  autoPlay 
                  muted 
                />

                {/* The reader div where html5-qrcode will render its UI */}
                <div id="reader" className="w-full z-10 bg-black/50 backdrop-blur-sm min-h-[400px]"></div>
                
                {hasCameraPermission === false && (
                  <div className="absolute inset-0 z-50 p-6 flex items-center justify-center bg-background/95 backdrop-blur-sm">
                    <Alert variant="destructive" className="max-w-sm">
                      <Camera className="h-4 w-4" />
                      <AlertTitle>Camera Access Required</AlertTitle>
                      <AlertDescription>
                        Please allow camera access in your browser settings to scan attendance QR codes.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {loading && (
                  <div className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center text-white">
                    <RefreshCw className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="font-bold tracking-widest uppercase">Verifying Scan...</p>
                  </div>
                )}
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
                <p className="text-muted-foreground mt-1 font-medium italic">Subject: Cloud Computing &bull; {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="w-full max-w-sm grid grid-cols-2 gap-4 text-left border-t border-dashed pt-8">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Student Name</p>
                  <p className="font-semibold text-primary">Alice Johnson</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Verification Date</p>
                  <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <Button className="w-full button-hover h-14 font-bold text-lg" onClick={resetScanner}>
                Scan Another Session
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-5 bg-muted/40 rounded-xl border border-muted flex items-start gap-4">
        <div className="p-2 bg-orange-100 rounded-lg shrink-0">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
        </div>
        <div className="text-sm">
          <p className="font-bold text-foreground mb-1">Campus Guard Policy</p>
          <p className="text-muted-foreground leading-relaxed">
            Attendance scans are normally validated against local network headers. {wifiBypass ? "Bypass mode is currently active for this session." : "Ensure you are connected to the campus WiFi for automatic validation."}
          </p>
        </div>
      </div>
    </div>
  );
}
