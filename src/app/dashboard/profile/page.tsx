
"use client";

import { useState, useEffect } from "react";
import { User as UserIcon, Mail, Shield, BookOpen, Camera, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, getCurrentUser, updateUserProfile } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [saving, setSaving] = useState(false);
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

  const handleSave = async () => {
    setSaving(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1000));
    
    const updated = updateUserProfile({ name, email, photo });
    
    if (updated) {
      setUser(updated);
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
      // Force a partial refresh of components depending on localStorage
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
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-primary/10 overflow-hidden bg-muted">
              <img src={photo} alt={name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-xl font-bold mt-4 text-center">{name}</h2>
          <p className="text-sm text-muted-foreground font-medium">{user.role}</p>
          
          <div className="w-full mt-6 space-y-2">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg text-xs font-medium">
              <Mail className="w-4 h-4 text-primary" />
              {email}
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
            <CardDescription>Manage your name and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Display Name</Label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Profile Picture URL</Label>
                <Input 
                  value={photo} 
                  onChange={(e) => setPhoto(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
                <p className="text-[10px] text-muted-foreground italic">Enter a public image URL to update your avatar.</p>
              </div>
              <div className="space-y-2">
                <Label>Unique ID (Read-only)</Label>
                <Input value={user.id} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Assigned Role</Label>
                <Input value={user.role} disabled className="bg-muted" />
              </div>
            </div>
            
            <div className="pt-4 border-t space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-sm">Security Policy</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Passwords can only be changed by a System Administrator. Contact IT support if you've forgotten your current credentials.
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
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Profile
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
