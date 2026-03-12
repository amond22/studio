
"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, Scan, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StudentScannerPage() {
  const [isOnline, setIsOnline] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const { toast } = useToast();

  // Mock WiFi Check
  useEffect(() => {
    // In a real app, we'd check the IP or SSID if possible via a backend check
    const checkNetwork = setTimeout(() => setIsOnline(true), 1500);
    return () => clearTimeout(checkNetwork);
  }, []);

  useEffect(() => {
    if (isOnline && !scanResult) {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (error) => {
          // ignore scan errors
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error(e));
      }
    };
  }, [isOnline, scanResult]);

  const handleScanSuccess = (result: string) => {
    if (scannerRef.current) {
      scannerRef.current.pause();
    }
    setLoading(true);
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
      <div className="flex items-center gap-3">
        <Scan className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-headline font-bold text-primary">Attendance Scanner</h1>
      </div>

      {!isOnline ? (
        <Card className="border-none shadow-sm animate-pulse">
          <CardContent className="py-12 flex flex-col items-center gap-4">
            <WifiOff className="w-12 h-12 text-muted-foreground" />
            <p className="font-medium text-muted-foreground text-lg">Verifying College Network...</p>
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence mode="wait">
          {!scanResult ? (
            <motion.div
              key="scanner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Camera View</CardTitle>
                      <CardDescription>Position the QR code within the frame</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200 text-xs font-bold">
                      <Wifi className="w-3 h-3" />
                      Balmiki_WiFi
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 bg-black min-h-[400px] flex items-center justify-center relative">
                  <div id="reader" className="w-full"></div>
                  {loading && (
                    <div className="absolute inset-0 bg-black/60 z-20 flex flex-col items-center justify-center text-white">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="font-bold">Verifying Attendance...</p>
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
              <div className="p-12 bg-white rounded-2xl shadow-xl flex flex-col items-center gap-6">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Attendance Successful!</h2>
                  <p className="text-muted-foreground mt-1">Cloud Computing &bull; 10:15 AM</p>
                </div>
                <div className="w-full max-w-sm grid grid-cols-2 gap-4 text-left border-t pt-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Student</p>
                    <p className="font-medium">Alice Johnson</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Date</p>
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <Button className="w-full button-hover h-12" onClick={resetScanner}>
                  Scan Another Class
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <div className="p-4 bg-muted/50 rounded-lg flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-bold text-foreground">Network Restricted Session</p>
          <p>Attendance is only valid if marked from within the college campus. Using VPNs or spoofing locations may lead to disciplinary action.</p>
        </div>
      </div>
    </div>
  );
}
