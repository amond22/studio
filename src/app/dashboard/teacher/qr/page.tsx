
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { QrCode, RefreshCw, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function GenerateQRPage() {
  const [subject, setSubject] = useState("");
  const [activeQR, setActiveQR] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!subject) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please select a subject first." });
      return;
    }
    const uniqueId = `ATT-${subject}-${Date.now()}`;
    setActiveQR(uniqueId);
    setTimeLeft(60);
    toast({ title: "QR Generated", description: "Students can now scan to mark attendance." });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeQR && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setActiveQR(null);
      toast({ title: "QR Expired", description: "The session has timed out." });
    }
    return () => clearInterval(timer);
  }, [activeQR, timeLeft, toast]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <QrCode className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-headline font-bold text-primary">Attendance QR</h1>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Session Control</CardTitle>
          <CardDescription>Select the current class and generate a temporary QR code</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Active Subject</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BIT-DBS">Database Systems (BIT)</SelectItem>
                <SelectItem value="BIT-OOP">Object Oriented Programming (BIT)</SelectItem>
                <SelectItem value="BBA-MKT">Marketing Management (BBA)</SelectItem>
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
                <Button className="w-full h-12 button-hover font-bold" onClick={handleGenerate}>
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
                <div className="p-8 bg-white rounded-2xl shadow-xl border-4 border-primary/20">
                  <QRCodeSVG 
                    value={activeQR} 
                    size={240}
                    level="H"
                    includeMargin
                  />
                </div>
                
                <div className="flex items-center gap-6 w-full">
                  <div className="flex-1 p-3 bg-muted rounded-lg flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-mono font-bold text-xl">
                      00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                    </span>
                  </div>
                  <Button variant="outline" className="flex-1 h-12 button-hover" onClick={handleGenerate}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Timer
                  </Button>
                </div>

                <div className="flex items-start gap-2 p-3 bg-accent/10 rounded-lg text-accent text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>Students must be connected to <strong>Balmiki_Lincoln_WiFi</strong> to successfully scan this code.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
