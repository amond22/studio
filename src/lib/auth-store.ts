
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
  lcNo?: string;
  address?: string;
  attendanceRate?: number;
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
    photo: "https://picsum.photos/seed/student/150/150",
    lcNo: "LC-2024-001",
    address: "Bharatpur-10, Chitwan",
    attendanceRate: 92
  }
];

/**
 * Retrieves the current list of users from localStorage.
 * Always initializes with DEFAULT_USERS if empty.
 */
export const getStoredUsers = (): User[] => {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  
  const stored = localStorage.getItem('eduscan_users');
  if (!stored) {
    localStorage.setItem('eduscan_users', JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : DEFAULT_USERS;
  } catch (e) {
    console.error("Failed to parse stored users:", e);
    return DEFAULT_USERS;
  }
};

/**
 * Saves a new user list to localStorage.
 */
export const saveUsers = (users: User[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('eduscan_users', JSON.stringify(users));
    // Dispatch a storage event to notify other tabs/components
    window.dispatchEvent(new Event('storage'));
  }
};

/**
 * Authenticates a user based on ID, Role, and Password.
 */
export const login = (userId: string, role: UserRole, passwordInput: string): User | null => {
  // Always fetch fresh users from storage to ensure newly created ones are included
  const users = getStoredUsers();
  
  const cleanId = userId.trim().toLowerCase();
  const cleanPass = passwordInput.trim();
  
  const user = users.find(u => 
    u.id.toLowerCase() === cleanId && 
    u.role === role && 
    (u.password === cleanPass)
  );

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

export const updateUserProfile = (updatedData: Partial<User>): User | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const users = getStoredUsers();
  const userIndex = users.findIndex(u => u.id === currentUser.id);

  if (userIndex !== -1) {
    const updatedUser = { ...users[userIndex], ...updatedData };
    users[userIndex] = updatedUser;
    
    saveUsers(users);
    localStorage.setItem('user_session', JSON.stringify(updatedUser));
    
    return updatedUser;
  }
  return null;
};
