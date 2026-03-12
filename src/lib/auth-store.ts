
"use client";

export type UserRole = 'Admin' | 'Teacher' | 'Student';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  faculty?: string;
  semester?: number;
  photo: string;
}

const mockUsers: User[] = [
  {
    id: "A001",
    name: "Admin Principal",
    role: "Admin",
    email: "admin@balmiki.edu",
    photo: "https://picsum.photos/seed/admin/150/150"
  },
  {
    id: "T101",
    name: "Dr. Robert Smith",
    role: "Teacher",
    email: "robert@balmiki.edu",
    photo: "https://picsum.photos/seed/teacher/150/150"
  },
  {
    id: "S202",
    name: "Alice Johnson",
    role: "Student",
    email: "alice@balmiki.edu",
    faculty: "BIT",
    semester: 4,
    photo: "https://picsum.photos/seed/student/150/150"
  }
];

export const login = (userId: string, role: UserRole): User | null => {
  const user = mockUsers.find(u => u.id === userId && u.role === role);
  if (user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_session', JSON.stringify(user));
    }
    return user;
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
