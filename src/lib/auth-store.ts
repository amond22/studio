
"use client";

export type UserRole = 'Admin' | 'Teacher' | 'Student';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  password?: string;
  faculty?: string;
  semester?: number;
  photo: string;
}

const DEFAULT_USERS: User[] = [
  {
    id: "admin",
    name: "System Administrator",
    role: "Admin",
    email: "admin@balmiki.edu",
    password: "admin-password",
    photo: "https://picsum.photos/seed/admin/150/150"
  },
  {
    id: "teacher",
    name: "Dr. Robert Smith",
    role: "Teacher",
    email: "robert@balmiki.edu",
    password: "teacher-password",
    photo: "https://picsum.photos/seed/teacher/150/150"
  },
  {
    id: "student",
    name: "Alice Johnson",
    role: "Student",
    email: "alice@balmiki.edu",
    password: "student-password",
    faculty: "BIT",
    semester: 4,
    photo: "https://picsum.photos/seed/student/150/150"
  }
];

const getStoredUsers = (): User[] => {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  const stored = localStorage.getItem('eduscan_users');
  if (!stored) {
    localStorage.setItem('eduscan_users', JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  return JSON.parse(stored);
};

export const login = (userId: string, role: UserRole, passwordInput: string): User | null => {
  const users = getStoredUsers();
  const user = users.find(u => 
    u.id.toLowerCase() === userId.toLowerCase() && 
    u.role === role && 
    u.password === passwordInput
  );

  if (user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_session', JSON.stringify(user));
    }
    return user;
  }
  return null;
};

export const updateUserProfile = (updatedData: Partial<User>): User | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const users = getStoredUsers();
  const userIndex = users.findIndex(u => u.id === currentUser.id);

  if (userIndex !== -1) {
    const updatedUser = { ...users[userIndex], ...updatedData };
    users[userIndex] = updatedUser;
    
    localStorage.setItem('eduscan_users', JSON.stringify(users));
    localStorage.setItem('user_session', JSON.stringify(updatedUser));
    
    return updatedUser;
  }
  return null;
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const session = localStorage.getItem('user_session');
  return session ? JSON.parse(session) : null;
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_session');
  }
};
