
"use client";

import { useState, useEffect, useRef } from "react";
import { User as UserIcon, Mail, Shield, BookOpen, Camera, Save, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, getCurrentUser, updateUserProfile } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setName(currentUser.name);
      setEmail(currentUser.email);
      setPhoto(currentUser.photo);
    }
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
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    
    const updated = updateUserProfile({ name, email, photo });
    
    if (updated) {
      setUser(updated);
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
      window.dispatchEvent(new Event('storage'));
    }
    setSaving(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <UserIcon className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-headline font-bold text-primary">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="border-none shadow-sm flex flex-col items-center p-8 lg:col-span-1">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <Avatar className="w-32 h-32 border-4 border-primary/10 shadow-md">
              <AvatarImage src={photo} />
              <AvatarFallback className="bg-muted text-2xl font-bold">{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div className="absolute bottom-1 right-1 p-2 bg-primary text-white rounded-full shadow-lg">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
          <h2 className="text-xl font-bold mt-4 text-center">{name}</h2>
          <p className="text-sm text-muted-foreground font-medium">{user.role}</p>
          
          <div className="w-full mt-6 space-y-2">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg text-xs font-medium">
              <Mail className="w-4 h-4 text-primary" />
              <span className="truncate">{email}</span>
            </div>
            {user.faculty && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg text-xs font-medium">
                <BookOpen className="w-4 h-4 text-primary" />
                {user.faculty} - Sem {user.semester}
              </div>
            )}
          </div>
        </Card>

        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Update your personal info and profile photo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@balmiki.edu" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Profile Picture</Label>
                <div className="flex gap-2">
                  <Input 
                    value={photo.startsWith('data:') ? 'Custom local image uploaded' : photo} 
                    onChange={(e) => setPhoto(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                  />
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" /> Upload File
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground italic">You can upload a file from your computer or provide a public URL.</p>
              </div>
              <div className="space-y-2">
                <Label>Portal ID</Label>
                <Input value={user.id} disabled className="bg-muted uppercase font-bold text-primary" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={user.role} disabled className="bg-muted" />
              </div>
            </div>
            
            <div className="pt-4 border-t space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-sm">Account Security</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your credentials are managed by the System Admin. If you need to change your password, please contact the IT department.
              </p>
            </div>

            <Button 
              className="w-full button-hover h-12 font-bold" 
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
