
"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Mail, Shield, MoreHorizontal, UserPlus, GraduationCap, Search, FileBarChart } from "lucide-react";
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
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, getStoredUsers, saveUsers, UserRole } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by name or ID..." 
          className="pl-10" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted overflow-hidden shrink-0">
                          <img src={user.photo} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p>{user.name}</p>
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
                      <Button variant="ghost" size="icon">
                        <FileBarChart className="w-4 h-4 text-primary" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
