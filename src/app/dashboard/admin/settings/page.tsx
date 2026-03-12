
"use client";

import { useState, useEffect, useRef } from "react";
import { Settings, Wifi, Globe, ShieldCheck, Save, Image as ImageIcon, RefreshCcw, Loader2, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getCollegeLogo, setCollegeLogo, getNetworkSettings, saveNetworkSettings, NetworkSettings } from "@/lib/auth-store";

export default function NetworkSettingsPage() {
  const [settings, setSettings] = useState<NetworkSettings | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setLogoUrl(getCollegeLogo());
    setSettings(getNetworkSettings());
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image smaller than 2MB."
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoUrl(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveNetworkSettings = () => {
    if (!settings) return;
    setSaving(true);
    saveNetworkSettings(settings);
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Configuration Saved",
        description: "Network restriction policies have been updated and stored.",
      });
    }, 800);
  };

  const handleSaveBranding = () => {
    if (!logoUrl) {
      toast({ variant: "destructive", title: "Invalid Logo", description: "Logo cannot be empty." });
      return;
    }
    setSaving(true);
    setCollegeLogo(logoUrl);
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Branding Updated",
        description: "The college logo has been saved and updated system-wide.",
      });
    }, 800);
  };

  const resetLogo = () => {
    const defaultLogo = "https://picsum.photos/seed/edu1/200/200";
    setLogoUrl(defaultLogo);
    setCollegeLogo(defaultLogo);
    toast({ title: "Logo Reset", description: "Default college logo restored." });
  };

  if (!settings) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Settings className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-headline font-bold text-primary">College Controls</h1>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>College Branding</CardTitle>
              <CardDescription>Update the institution logo from a URL or local file</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-muted/30 rounded-2xl border">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-white border-4 border-white shadow-md shrink-0 flex items-center justify-center">
              <img src={logoUrl} alt="College Logo Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-4 w-full">
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Logo Source</Label>
                
                <div className="grid gap-3">
                  <div className="flex gap-2">
                    <Input 
                      value={logoUrl.startsWith('data:') ? 'Custom local image uploaded' : logoUrl} 
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="Paste Image URL"
                      className="bg-white"
                    />
                    <Button variant="outline" size="icon" onClick={resetLogo} title="Reset to default">
                      <RefreshCcw className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                    />
                    <Button 
                      variant="secondary" 
                      className="w-full flex items-center gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4" />
                      Upload From Computer
                    </Button>
                  </div>
                </div>
                
                <p className="text-[10px] text-muted-foreground italic">Uploaded images are converted to local data and saved instantly.</p>
              </div>
              <Button className="w-full sm:w-auto" onClick={handleSaveBranding} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Update Branding
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
            <Switch 
              checked={settings.restrictionEnabled} 
              onCheckedChange={(val) => setSettings({ ...settings, restrictionEnabled: val })} 
            />
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
                  value={settings.wifiSsid} 
                  onChange={(e) => setSettings({ ...settings, wifiSsid: e.target.value })}
                  disabled={!settings.restrictionEnabled}
                  className="mt-1 bg-white"
                />
                <p className="text-[10px] text-muted-foreground mt-1">Students must be connected to this SSID to mark attendance.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Globe className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <Label className="text-sm font-bold">College IP Range</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    placeholder="192.168.1.1" 
                    value={settings.ipRangeStart}
                    onChange={(e) => setSettings({ ...settings, ipRangeStart: e.target.value })}
                    disabled={!settings.restrictionEnabled}
                    className="bg-white"
                  />
                  <span className="flex items-center text-muted-foreground">—</span>
                  <Input 
                    placeholder="192.168.1.255" 
                    value={settings.ipRangeEnd}
                    onChange={(e) => setSettings({ ...settings, ipRangeEnd: e.target.value })}
                    disabled={!settings.restrictionEnabled}
                    className="bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border-2 border-dashed flex flex-col items-center gap-2 text-center bg-accent/5">
            <ShieldCheck className="w-10 h-10 text-accent mb-2" />
            <p className="font-bold">Security Enforcement</p>
            <p className="text-xs text-muted-foreground max-w-sm">
              All settings saved here are persistent. Students will be blocked from scanning if they don't meet these requirements.
            </p>
          </div>

          <Button className="w-full button-hover h-12 font-bold" onClick={handleSaveNetworkSettings} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Network Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

