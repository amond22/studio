
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole, login } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, User as UserIcon, Building2, Info } from "lucide-react";

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>("Student");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate small delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = login(userId, role);

    if (user) {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      });
      router.push("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please check your User ID and Role. IDs are: admin, teacher, or student.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-4">
            <Building2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-primary">EduScan Attend</h1>
          <p className="text-muted-foreground mt-2">Balmiki Lincoln College Portal</p>
        </div>

        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle className="text-xl">Welcome Back</CardTitle>
              <CardDescription>Enter your credentials to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Your Role</Label>
                <Select value={role} onValueChange={(val) => setRole(val as UserRole)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Teacher">Teacher</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="userId"
                    placeholder="e.g. admin, teacher, student"
                    className="pl-10 bg-white"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="any password"
                    className="pl-10 bg-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-accent/5 rounded-lg border border-accent/20 flex gap-3 items-start">
                <Info className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <div className="text-[10px] text-muted-foreground leading-tight">
                  <p className="font-bold text-accent mb-1 uppercase tracking-wider">Demo Credentials:</p>
                  <ul className="list-disc pl-3 space-y-0.5">
                    <li><strong>Admin:</strong> ID: <code className="bg-accent/10 px-1 rounded">admin</code></li>
                    <li><strong>Teacher:</strong> ID: <code className="bg-accent/10 px-1 rounded">teacher</code></li>
                    <li><strong>Student:</strong> ID: <code className="bg-accent/10 px-1 rounded">student</code></li>
                    <li><strong>Password:</strong> Any value</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full button-hover bg-primary h-11 text-lg" 
                disabled={loading}
              >
                {loading ? "Verifying..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Secure biometric-ready QR attendance system
        </p>
      </motion.div>
    </div>
  );
}
