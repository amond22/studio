
"use client";

import { useState } from "react";
import { Settings, Wifi, Globe, ShieldCheck, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function NetworkSettingsPage() {
  const [restrictionEnabled, setRestrictionEnabled] = useState(true);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Network restriction policies have been updated.",
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-headline font-bold text-primary">Network Control</h1>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Attendance Guard</CardTitle>
              <CardDescription>Configure WiFi and IP restrictions for student scans</CardDescription>
            </div>
            <Switch checked={restrictionEnabled} onCheckedChange={setRestrictionEnabled} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Wifi className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <Label htmlFor="wifi-name" className="text-sm font-bold">Allowed WiFi SSID</Label>
                <Input 
                  id="wifi-name" 
                  defaultValue="Balmiki_Lincoln_WiFi" 
                  disabled={!restrictionEnabled}
                  className="mt-1"
                />
                <p className="text-[10px] text-muted-foreground mt-1">Students must be connected to this specific network name.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Globe className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <Label htmlFor="ip-range" className="text-sm font-bold">College IP Range</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    placeholder="192.168.1.1" 
                    disabled={!restrictionEnabled}
                  />
                  <span className="flex items-center text-muted-foreground">—</span>
                  <Input 
                    placeholder="192.168.1.255" 
                    disabled={!restrictionEnabled}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Restrict scans to these local network IP addresses.</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border-2 border-dashed flex flex-col items-center gap-2 text-center bg-accent/5">
            <ShieldCheck className="w-10 h-10 text-accent mb-2" />
            <p className="font-bold">Security Mode Active</p>
            <p className="text-xs text-muted-foreground max-w-sm">
              When enabled, the system validates the client's network environment before recording attendance records.
            </p>
          </div>

          <Button className="w-full button-hover h-11" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
