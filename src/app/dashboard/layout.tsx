
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/shared/sidebar";
import { User, getCurrentUser } from "@/lib/auth-store";
import { Bell, Search, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/login");
    } else {
      setUser(currentUser);
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar user={user} />
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-white flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 w-1/3">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search records..." className="pl-10 bg-muted/30 border-none" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-muted relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-border mx-2" />
            <button className="flex items-center gap-2 p-1 pl-3 rounded-full hover:bg-muted border transition-colors">
              <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
