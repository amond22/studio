
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { login, getCurrentUser, getStoredUsers, UserRole } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, User as UserIcon, Building2, Info, ArrowRight, Loader2, ShieldCheck, GraduationCap, Users } from "lucide-react";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Student");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Ensure default users exist in storage
    getStoredUsers();
    
    const user = getCurrentUser();
    if (user) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Minor delay for feedback
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = login(userId, password, role);

    if (user) {
      toast({
        title: "Access Granted",
        description: `Welcome to the ${role} Dashboard, ${user.name}.`,
      });
      router.push("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: `Invalid Portal ID or Password for the ${role} portal.`,
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-4 shadow-inner">
            <Building2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">EduScan Portal</h1>
          <p className="text-muted-foreground mt-2 font-medium text-sm">Balmiki Lincoln College Management</p>
        </div>

        <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-md overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle className="text-xl font-bold">Secure Sign In</CardTitle>
            <CardDescription>Select your portal and enter credentials</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-6 pt-6">
              <Tabs value={role} onValueChange={(v) => setRole(v as UserRole)} className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-12 bg-muted/50 p-1">
                  <TabsTrigger value="Student" className="gap-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Users className="w-3.5 h-3.5" />
                    Student
                  </TabsTrigger>
                  <TabsTrigger value="Teacher" className="gap-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Teacher
                  </TabsTrigger>
                  <TabsTrigger value="Admin" className="gap-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">Portal Login ID</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="userId"
                      placeholder={`Enter ${role.toLowerCase()} ID`}
                      className="pl-10 h-11 bg-white border-muted focus:ring-primary"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Security Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter Password"
                      className="pl-10 h-11 bg-white border-muted focus:ring-primary"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-primary" />
                  <p className="font-bold text-primary text-[10px] uppercase tracking-widest">Login Help</p>
                </div>
                <ul className="text-[11px] text-muted-foreground space-y-1 ml-1">
                  <li>• IDs are case-insensitive.</li>
                  <li>• Passwords are case-sensitive.</li>
                  <li>• Ensure the correct <strong>Role Tab</strong> is active.</li>
                </ul>
              </div>
            </CardContent>
            
            <CardFooter className="pb-8">
              <Button 
                type="submit" 
                className="w-full button-hover bg-primary h-12 text-base font-bold shadow-lg shadow-primary/20" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In to Portal
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-8">
          &copy; {new Date().getFullYear()} Balmiki Lincoln College. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
