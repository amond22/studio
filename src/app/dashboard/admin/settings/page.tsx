
"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Settings, Wifi, Globe, ShieldCheck, Save, Image as ImageIcon, 
  RefreshCcw, Loader2, Upload, CalendarDays, Plus, Trash2, 
  Palmtree, CalendarX 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  getCollegeLogo, setCollegeLogo, getNetworkSettings, 
  saveNetworkSettings, NetworkSettings, VacationPeriod 
} from "@/lib/auth-store";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function NetworkSettingsPage() {
  const [settings, setSettings] = useState<NetworkSettings | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [newHoliday, setNewHoliday] = useState("");
  const [newVacation, setNewVacation] = useState({ title: "", start: "", end: "" });
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
        toast({ variant: "destructive", title: "File too large", description: "Image smaller than 2MB required." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setLogoUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAll = () => {
    if (!settings) return;
    setSaving(true);
    saveNetworkSettings(settings);
    setTimeout(() => {
      setSaving(false);
      toast({ title: "Configuration Saved", description: "Academic calendar and restrictions updated." });
    }, 800);
  };

  const handleAddHoliday = () => {
    if (!newHoliday || !settings) return;
    if (settings.holidays.includes(newHoliday)) return;
    setSettings({ ...settings, holidays: [...settings.holidays, newHoliday].sort() });
    setNewHoliday("");
  };

  const handleRemoveHoliday = (h: string) => {
    if (!settings) return;
    setSettings({ ...settings, holidays: settings.holidays.filter(date => date !== h) });
  };

  const handleAddVacation = () => {
    if (!newVacation.title || !newVacation.start || !newVacation.end || !settings) return;
    const v: VacationPeriod = { ...newVacation, id: Date.now().toString() };
    setSettings({ ...settings, vacations: [...settings.vacations, v] });
    setNewVacation({ title: "", start: "", end: "" });
  };

  const handleRemoveVacation = (id: string) => {
    if (!settings) return;
    setSettings({ ...settings, vacations: settings.vacations.filter(v => v.id !== id) });
  };

  if (!settings) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Settings className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-headline font-bold text-primary">College Controls</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Main Academic Dates */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                <CardTitle>Academic Session</CardTitle>
              </div>
              <CardDescription>Nepal Standard: Saturdays automatically excluded from rates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase font-bold text-muted-foreground">Session Start</Label>
                  <Input type="date" value={settings.openingDate} onChange={(e) => setSettings({ ...settings, openingDate: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase font-bold text-muted-foreground">Session End</Label>
                  <Input type="date" value={settings.closingDate} onChange={(e) => setSettings({ ...settings, closingDate: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Holiday Management */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CalendarX className="w-5 h-5 text-primary" />
                <CardTitle>Public Holidays</CardTitle>
              </div>
              <CardDescription>Individual non-working days (Festival, Public Holiday)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input type="date" value={newHoliday} onChange={(e) => setNewHoliday(e.target.value)} />
                <Button variant="secondary" onClick={handleAddHoliday}><Plus className="w-4 h-4" /></Button>
              </div>
              <ScrollArea className="h-32 rounded-md border p-2">
                <div className="flex flex-wrap gap-2">
                  {settings.holidays.map(h => (
                    <Badge key={h} variant="secondary" className="gap-1 pl-3 py-1">
                      {h}
                      <button onClick={() => handleRemoveHoliday(h)} className="hover:text-destructive">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  {settings.holidays.length === 0 && <p className="text-xs text-muted-foreground p-2">No holidays added.</p>}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Vacation Periods */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palmtree className="w-5 h-5 text-primary" />
                <CardTitle>Vacation Periods</CardTitle>
              </div>
              <CardDescription>Extended breaks (Winter/Summer/Dashain Vacation)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 p-4 bg-muted/30 rounded-xl border">
                <Input placeholder="Vacation Title" value={newVacation.title} onChange={(e) => setNewVacation({ ...newVacation, title: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <Input type="date" value={newVacation.start} onChange={(e) => setNewVacation({ ...newVacation, start: e.target.value })} />
                  <Input type="date" value={newVacation.end} onChange={(e) => setNewVacation({ ...newVacation, end: e.target.value })} />
                </div>
                <Button className="w-full h-8" variant="outline" onClick={handleAddVacation}>Add Period</Button>
              </div>
              <div className="space-y-2">
                {settings.vacations.map(v => (
                  <div key={v.id} className="flex items-center justify-between p-3 bg-white border rounded-lg text-sm">
                    <div>
                      <p className="font-bold">{v.title}</p>
                      <p className="text-[10px] text-muted-foreground">{v.start} to {v.end}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleRemoveVacation(v.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Branding */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                <CardTitle>Institution Branding</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <img src={logoUrl} className="w-16 h-16 rounded-full border-2 p-1" alt="" />
                <div className="flex-1 space-y-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" /> Change Logo
                  </Button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  <Button variant="ghost" size="sm" className="w-full text-[10px] h-6" onClick={() => { setLogoUrl("https://picsum.photos/seed/edu1/200/200"); setCollegeLogo("https://picsum.photos/seed/edu1/200/200"); }}>Reset</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="border-none shadow-sm bg-accent/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-primary" />
                <CardTitle>Attendance Guard</CardTitle>
              </div>
              <Switch checked={settings.restrictionEnabled} onCheckedChange={(val) => setSettings({ ...settings, restrictionEnabled: val })} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Allowed WiFi SSID</Label>
                <Input value={settings.wifiSsid} onChange={(e) => setSettings({ ...settings, wifiSsid: e.target.value })} disabled={!settings.restrictionEnabled} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">IP Range</Label>
                <div className="flex gap-2">
                  <Input value={settings.ipRangeStart} onChange={(e) => setSettings({ ...settings, ipRangeStart: e.target.value })} disabled={!settings.restrictionEnabled} />
                  <Input value={settings.ipRangeEnd} onChange={(e) => setSettings({ ...settings, ipRangeEnd: e.target.value })} disabled={!settings.restrictionEnabled} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full h-16 font-bold text-lg button-hover" onClick={handleSaveAll} disabled={saving}>
          {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
          Apply Academic Configuration
        </Button>
      </div>
    </div>
  );
}
