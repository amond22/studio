
"use client";

import { useState, useEffect, useRef } from "react";
import { Users, Plus, Mail, Shield, UserPlus, GraduationCap, Search, FileBarChart, Filter, ChevronRight, Eye, MapPin, Hash, BarChart3, Edit, Save, X, KeyRound, Upload, Camera } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form State for Add/Edit
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalId, setOriginalId] = useState("");
  const [newUserId, setNewUserId] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("Student");
  const [newFaculty, setNewFaculty] = useState("BIT");
  const [newSemester, setNewSemester] = useState("1");
  const [newPassword, setNewPassword] = useState("");
  const [newLcNo, setNewLcNo] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newPhoto, setNewPhoto] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    setUsers(getStoredUsers());
  }, []);

  const resetForm = () => {
    setIsEditMode(false);
    setOriginalId("");
    setNewUserId("");
    setNewName("");
    setNewEmail("");
    setNewRole("Student");
    setNewFaculty("BIT");
    setNewSemester("1");
    setNewPassword("");
    setNewLcNo("");
    setNewAddress("");
    setNewPhoto("");
  };

  const handleOpenAdd = () => {
    resetForm();
    setOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setIsEditMode(true);
    setOriginalId(user.id);
    setNewUserId(user.id);
    setNewName(user.name);
    setNewEmail(user.email);
    setNewRole(user.role);
    setNewFaculty(user.faculty || "BIT");
    setNewSemester(user.semester?.toString() || "1");
    setNewPassword(user.password || "");
    setNewLcNo(user.lcNo || "");
    setNewAddress(user.address || "");
    setNewPhoto(user.photo || "");
    setOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image smaller than 2MB."
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveUser = () => {
    if (!newUserId || !newName || !newEmail || !newPassword) {
      toast({ variant: "destructive", title: "Error", description: "All fields including Portal Login ID and Password are required" });
      return;
    }

    if (!isEditMode || (isEditMode && newUserId.toLowerCase() !== originalId.toLowerCase())) {
      const exists = users.find(u => u.id.toLowerCase() === newUserId.toLowerCase());
      if (exists) {
        toast({ variant: "destructive", title: "ID Conflict", description: "This Portal Login ID is already taken." });
        return;
      }
    }

    const finalPhoto = newPhoto || `https://picsum.photos/seed/${newUserId}/150/150`;

    const updatedUser: User = {
      id: newUserId,
      name: newName,
      email: newEmail,
      role: newRole,
      password: newPassword,
      faculty: newRole === 'Student' ? newFaculty : undefined,
      semester: newRole === 'Student' ? parseInt(newSemester) : undefined,
      lcNo: newRole === 'Student' ? newLcNo : undefined,
      address: newRole === 'Student' ? newAddress : undefined,
      attendanceRate: isEditMode ? (users.find(u => u.id === originalId)?.attendanceRate || 0) : 0,
      photo: finalPhoto
    };

    let updatedUsersList;
    if (isEditMode) {
      updatedUsersList = users.map(u => u.id === originalId ? updatedUser : u);
      toast({ title: "Account Updated", description: `${newName}'s credentials updated.` });
    } else {
      updatedUsersList = [...users, updatedUser];
      toast({ title: "Account Created", description: `${newName} is now registered.` });
    }

    setUsers(updatedUsersList);
    saveUsers(updatedUsersList);
    setOpen(false);
    resetForm();
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-primary">Portal Accounts</h1>
        </div>
        
        <Button onClick={handleOpenAdd} className="button-hover w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add New Account
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Account" : "Register Account"}</DialogTitle>
              <DialogDescription>
                Set the credentials and academic profile for the user.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6 py-4">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <Avatar className="w-24 h-24 border-4 border-primary/10">
                      <AvatarImage src={newPhoto || `https://picsum.photos/seed/${newUserId || 'new'}/150/150`} />
                      <AvatarFallback className="bg-primary/5 text-primary">
                        <Camera className="w-8 h-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Click to upload photo</p>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl space-y-4">
                  <p className="text-xs font-bold uppercase text-primary tracking-widest flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5" /> Portal Credentials
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Portal Login ID</Label>
                      <Input placeholder="e.g., student01" value={newUserId} onChange={(e) => setNewUserId(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Portal Password</Label>
                      <Input placeholder="Set password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Account Role</Label>
                    <Select value={newRole} onValueChange={(v) => setNewRole(v as UserRole)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">System Admin</SelectItem>
                        <SelectItem value="Teacher">Teacher Panel</SelectItem>
                        <SelectItem value="Student">Student Portal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {newRole === 'Student' && (
                  <div className="space-y-4 pt-4 border-t">
                    <p className="text-xs font-bold uppercase text-primary tracking-widest">Academic Identity</p>
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
                    <div className="space-y-2">
                      <Label>Class LC Number</Label>
                      <Input placeholder="LC-2024-XXXX" value={newLcNo} onChange={(e) => setNewLcNo(e.target.value)} />
                    </div>
                  </div>
                )}

                <div className="space-y-4 pt-4 border-t">
                  <p className="text-xs font-bold uppercase text-primary tracking-widest">Personal Details</p>
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input placeholder="John Doe" value={newName} onChange={(e) => setNewName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input type="email" placeholder="john@balmiki.edu" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                  </div>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveUser}>{isEditMode ? "Save Changes" : "Create Account"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or Portal ID..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
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
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>User Identity</TableHead>
                <TableHead>Portal Role</TableHead>
                <TableHead>Login ID</TableHead>
                <TableHead className="text-right">Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="group hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border bg-white">
                        <AvatarImage src={user.photo} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-sm">{user.name}</p>
                        <p className="text-[10px] text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'Admin' ? 'default' : user.role === 'Teacher' ? 'accent' : 'secondary'} className="text-[10px] h-5">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs uppercase text-primary font-bold">
                    {user.id}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={() => handleOpenEdit(user)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                        setSelectedUser(user);
                        setDetailOpen(true);
                      }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>Profile Audit</DialogTitle>
                <DialogDescription>Full details for {selectedUser.name}</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-6 py-4">
                <Avatar className="w-24 h-24 border-4 border-primary/10 shadow-lg">
                  <AvatarImage src={selectedUser.photo} />
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="w-full space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl text-center">
                      <p className="text-[10px] font-bold uppercase text-primary mb-1">Login ID</p>
                      <p className="text-sm font-bold uppercase">{selectedUser.id}</p>
                    </div>
                    <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl text-center">
                      <p className="text-[10px] font-bold uppercase text-primary mb-1">Password</p>
                      <p className="text-sm font-bold">{selectedUser.password}</p>
                    </div>
                  </div>

                  {selectedUser.role === 'Student' && (
                    <div className="space-y-2">
                      <div className="p-3 bg-muted rounded-xl flex justify-between items-center text-xs">
                        <span className="font-bold text-muted-foreground uppercase">Faculty</span>
                        <span className="font-bold">{selectedUser.faculty} (Sem {selectedUser.semester})</span>
                      </div>
                      <div className="p-3 bg-muted rounded-xl flex justify-between items-center text-xs">
                        <span className="font-bold text-muted-foreground uppercase">LC Number</span>
                        <span className="font-bold">{selectedUser.lcNo || 'N/A'}</span>
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-muted/50 rounded-xl text-xs">
                    <p className="font-bold text-muted-foreground uppercase mb-1">Contact Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" className="flex-1" onClick={() => {
                  setDetailOpen(false);
                  handleOpenEdit(selectedUser);
                }}>
                  <Edit className="w-4 h-4 mr-2" /> Modify Account
                </Button>
                <Button className="flex-1" onClick={() => setDetailOpen(false)}>Done</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
