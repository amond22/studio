"use client";

import { useState, useEffect } from "react";
import { User as UserIcon, Mail, Shield, BookOpen, Camera, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, getCurrentUser } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <UserIcon className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-headline font-bold text-primary">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="border-none shadow-sm flex flex-col items-center p-8 lg:col-span-1">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-primary/10 overflow-hidden bg-muted">
              <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-xl font-bold mt-4">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.role}</p>
          <div className="w-full mt-6 space-y-2">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg text-sm">
              <Mail className="w-4 h-4 text-primary" />
              {user.email}
            </div>
            {user.faculty && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg text-sm">
                <BookOpen className="w-4 h-4 text-primary" />
                {user.faculty} - Semester {user.semester}
              </div>
            )}
          </div>
        </Card>

        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Update your personal information and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue={user.name} />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input defaultValue={user.email} />
              </div>
              <div className="space-y-2">
                <Label>User ID</Label>
                <Input defaultValue={user.id} disabled />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input defaultValue={user.role} disabled />
              </div>
            </div>
            
            <div className="pt-4 border-t space-y-4">
              <h3 className="font-bold flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security
              </h3>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
            </div>

            <Button className="w-full button-hover h-11" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
