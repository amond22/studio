
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole, login, getCurrentUser } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, User as UserIcon, Building2, Info, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>("Student");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = login(userId, role);

    if (user) {
      toast({
        title: "Welcome Back",
        description: `Successfully logged in as ${user.name}`,
      });
      router.push("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Invalid credentials. Please use the hints below for the demo.",
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
          <h1 className="text-3xl font-headline font-bold text-primary">EduScan Portal</h1>
          <p className="text-muted-foreground mt-2 font-medium">Balmiki Lincoln College Management</p>
        </div>

        <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-md">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Secure Sign In</CardTitle>
              <CardDescription>Select your role and enter your unique ID</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Account Type</Label>
                <Select value={role} onValueChange={(val) => setRole(val as UserRole)}>
                  <SelectTrigger className="bg-white border-muted h-11">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">System Administrator</SelectItem>
                    <SelectItem value="Teacher">Faculty / Teacher</SelectItem>
                    <SelectItem value="Student">Registered Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="userId"
                    placeholder="Enter ID (e.g. admin, teacher, student)"
                    className="pl-10 h-11 bg-white border-muted"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Security Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-11 bg-white border-muted"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex gap-4 items-start">
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <Info className="w-4 h-4 text-primary" />
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <p className="font-bold text-primary mb-1 uppercase tracking-widest">Demo Access Credentials</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                    <span className="font-semibold">Admin:</span> <span>ID: <code className="bg-white px-1 border rounded">admin</code></span>
                    <span className="font-semibold">Teacher:</span> <span>ID: <code className="bg-white px-1 border rounded">teacher</code></span>
                    <span className="font-semibold">Student:</span> <span>ID: <code className="bg-white px-1 border rounded">student</code></span>
                  </div>
                  <p className="mt-2 text-[10px] italic">Any password will work for this prototype.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full button-hover bg-primary h-12 text-base font-bold shadow-lg shadow-primary/20" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Sign In to Dashboard <ArrowRight className="w-4 h-4" />
                  </div>
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
