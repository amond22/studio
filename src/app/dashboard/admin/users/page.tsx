
"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Mail, Shield, MoreHorizontal, UserPlus, GraduationCap, Search, FileBarChart, Filter, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, getStoredUsers, saveUsers, UserRole } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [facultyFilter, setFacultyFilter] = useState<string>("all");
  const { toast } = useToast();

  // Form State
  const [newUserId, setNewUserId] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("Student");
  const [newFaculty, setNewFaculty] = useState("BIT");
  const [newSemester, setNewSemester] = useState("1");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    setUsers(getStoredUsers());
  }, []);

  const handleAddUser = () => {
    if (!newUserId || !newName || !newEmail || !newPassword) {
      toast({ variant: "destructive", title: "Error", description: "All fields are required" });
      return;
    }

    const newUser: User = {
      id: newUserId,
      name: newName,
      email: newEmail,
      role: newRole,
      password: newPassword,
      faculty: newRole === 'Student' ? newFaculty : undefined,
      semester: newRole === 'Student' ? parseInt(newSemester) : undefined,
      photo: `https://picsum.photos/seed/${newUserId}/150/150`
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    
    toast({ title: "User Added", description: `${newName} can now login.` });
    setOpen(false);
    
    // Reset form
    setNewUserId("");
    setNewName("");
    setNewEmail("");
    setNewPassword("");
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesFaculty = facultyFilter === "all" || u.faculty === facultyFilter;
    return matchesSearch && matchesRole && matchesFaculty;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-primary">User Management</h1>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="button-hover w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Register New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Account ID</Label>
                  <Input placeholder="jdoe" value={newUserId} onChange={(e) => setNewUserId(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={newRole} onValueChange={(v) => setNewRole(v as UserRole)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Teacher">Teacher</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {newRole === 'Student' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Faculty</Label>
                    <Select value={newFaculty} onValueChange={setNewFaculty}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BIT">BIT</SelectItem>
                        <SelectItem value="BBA">BBA</SelectItem>
                        <SelectItem value="BHM">BHM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Semester</Label>
                    <Select value={newSemester} onValueChange={setNewSemester}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8].map(s => (
                          <SelectItem key={s} value={s.toString()}>Sem {s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="John Doe" value={newName} onChange={(e) => setNewName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="john@balmiki.edu" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full" onClick={handleAddUser}>Create Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or ID..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Admin">Admins</SelectItem>
              <SelectItem value="Teacher">Teachers</SelectItem>
              <SelectItem value="Student">Students</SelectItem>
            </SelectContent>
          </Select>
          <Select value={facultyFilter} onValueChange={setFacultyFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Faculties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Faculties</SelectItem>
              <SelectItem value="BIT">BIT Faculty</SelectItem>
              <SelectItem value="BBA">BBA Faculty</SelectItem>
              <SelectItem value="BHM">BHM Faculty</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle>All Registered Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name & ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Academic Info</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                  <TableRow 
                    key={user.id} 
                    className="cursor-pointer group hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setSelectedUser(user);
                      setDetailOpen(true);
                    }}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted overflow-hidden shrink-0 border border-primary/10">
                          <img src={user.photo} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="group-hover:text-primary transition-colors">{user.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono uppercase">{user.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.role === 'Student' ? (
                        <div className="flex flex-col gap-1">
                          <Badge variant="secondary" className="w-fit text-[10px] h-5">
                            <GraduationCap className="w-3 h-3 mr-1" />
                            {user.faculty}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-1">Semester {user.semester}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex w-fit items-center gap-1">
                        <Shield className="w-3 h-3" />
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="group-hover:bg-primary/10 transition-all">
                        <ChevronRight className="w-4 h-4 text-primary" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      No users found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>User Profile Detail</DialogTitle>
                <DialogDescription>
                  Full system records for account ID: {selectedUser.id}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-6 py-4">
                <div className="w-24 h-24 rounded-full border-4 border-primary/10 overflow-hidden shadow-lg">
                  <img src={selectedUser.photo} alt={selectedUser.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-primary">{selectedUser.name}</h3>
                  <Badge variant="outline" className="mt-1">{selectedUser.role}</Badge>
                </div>
                <div className="w-full grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-xl">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Email</p>
                    <p className="text-sm font-medium truncate">{selectedUser.email}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-xl">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Account ID</p>
                    <p className="text-sm font-medium font-mono uppercase">{selectedUser.id}</p>
                  </div>
                  {selectedUser.faculty && (
                    <>
                      <div className="p-3 bg-muted rounded-xl">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Faculty</p>
                        <p className="text-sm font-medium">{selectedUser.faculty}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-xl">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Semester</p>
                        <p className="text-sm font-medium">{selectedUser.semester}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" className="w-full" onClick={() => setDetailOpen(false)}>Close</Button>
                <Button className="w-full">
                  <FileBarChart className="w-4 h-4 mr-2" />
                  Attendance Audit
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
