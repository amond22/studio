
"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  QrCode, 
  Scan, 
  Settings, 
  LogOut, 
  FileText,
  GraduationCap,
  Calendar,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { User, logout } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  user: User;
}

export function AppSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const menuItems = {
    Admin: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
      { icon: Users, label: "Users Management", href: "/dashboard/admin/users" },
      { icon: GraduationCap, label: "Faculties", href: "/dashboard/admin/faculties" },
      { icon: BookOpen, label: "Subjects", href: "/dashboard/admin/subjects" },
      { icon: FileText, label: "Reports", href: "/dashboard/admin/reports" },
      { icon: Settings, label: "Network Settings", href: "/dashboard/admin/settings" },
    ],
    Teacher: [
      { icon: LayoutDashboard, label: "My Classes", href: "/dashboard" },
      { icon: QrCode, label: "Generate QR", href: "/dashboard/teacher/qr" },
      { icon: Sparkles, label: "AI Insights", href: "/dashboard/teacher/insights" },
      { icon: FileText, label: "Reports", href: "/dashboard/teacher/reports" },
    ],
    Student: [
      { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
      { icon: Scan, label: "Scan QR", href: "/dashboard/student/scan" },
      { icon: Calendar, label: "Attendance History", href: "/dashboard/student/history" },
    ]
  };

  const currentMenu = menuItems[user.role];

  return (
    <div className="flex flex-col h-full bg-white border-r shadow-sm w-64">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <QrCode className="text-white w-5 h-5" />
          </div>
          <span className="font-headline font-bold text-xl text-primary">EduScan</span>
        </div>

        <nav className="space-y-1">
          {currentMenu.map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                pathname === item.href 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
            <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.role}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3 button-hover text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
