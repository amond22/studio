
"use client";

import { useState, useEffect } from "react";
import { Settings, Wifi, Globe, ShieldCheck, Save, Image as ImageIcon, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getCollegeLogo, setCollegeLogo } from "@/lib/auth-store";

export default function NetworkSettingsPage() {
  const [restrictionEnabled, setRestrictionEnabled] = useState(true);
  const [logoUrl, setLogoUrl] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    setLogoUrl(getCollegeLogo());
  }, []);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Network restriction policies have been updated.",
    });
  };

  const handleSaveBranding = () => {
    if (!logoUrl) {
      toast({ variant: "destructive", title: "Invalid URL", description: "Logo URL cannot be empty." });
      return;
    }
    setCollegeLogo(logoUrl);
    toast({
      title: "Branding Updated",
      description: "The college logo has been updated system-wide.",
    });
  };

  const resetLogo = () => {
    const defaultLogo = "https://picsum.photos/seed/edu1/200/200";
    setLogoUrl(defaultLogo);
    setCollegeLogo(defaultLogo);
    toast({ title: "Logo Reset", description: "Default college logo restored." });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-headline font-bold text-primary">College Controls</h1>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>College Branding</CardTitle>
              <CardDescription>Update the institution logo displayed on all portals</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-muted/30 rounded-2xl border">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-white border-4 border-white shadow-md shrink-0">
              <img src={logoUrl} alt="College Logo Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-4 w-full">
              <div className="space-y-2">
                <Label htmlFor="logo-url" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Logo Image URL</Label>
                <div className="flex gap-2">
                  <Input 
                    id="logo-url" 
                    value={logoUrl} 
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                  <Button variant="outline" size="icon" onClick={resetLogo} title="Reset to default">
                    <RefreshCcw className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground italic">Use a high-quality image URL (PNG or JPG recommended).</p>
              </div>
              <Button className="w-full sm:w-auto" onClick={handleSaveBranding}>
                <Save className="w-4 h-4 mr-2" /> Update Branding
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Attendance Guard</CardTitle>
                <CardDescription>Configure WiFi and IP restrictions for student scans</CardDescription>
              </div>
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

          <Button className="w-full button-hover h-11" onClick={handleSaveSettings}>
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
