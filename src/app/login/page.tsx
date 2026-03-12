
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
import { KeyRound, User as UserIcon, Building2, Info, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>("Student");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Short artificial delay for UX feel
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = login(userId, role, password);

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
        description: "Invalid credentials. Please verify your ID, Password, and Role.",
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
          <p className="text-muted-foreground mt-2 font-medium text-sm">Balmiki Lincoln College Management</p>
        </div>

        <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-md">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Secure Sign In</CardTitle>
              <CardDescription>Enter your official credentials</CardDescription>
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
                    placeholder="Enter unique ID"
                    className="pl-10 h-11 bg-white border-muted"
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
                  <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter Password"
                    className="pl-10 h-11 bg-white border-muted"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-primary" />
                  <p className="font-bold text-primary text-[10px] uppercase tracking-widest">Account Note</p>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Ensure the correct <strong>Account Type</strong> is selected before signing in. New accounts created in Admin Panel are available immediately.
                </p>
              </div>
            </CardContent>
            <CardFooter>
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
                    Sign In to Dashboard
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
