
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
  section?: string;
  photo: string;
  lcNo?: string;
  address?: string;
  attendanceRate?: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  faculty: string;
  semester: number;
  section: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  markedBy: string;
  timestamp?: string;
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
    section: "A",
    photo: "https://picsum.photos/seed/student/150/150",
    lcNo: "LC-2024-001",
    address: "Bharatpur-10, Chitwan",
    attendanceRate: 92
  }
];

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
    return DEFAULT_USERS;
  }
};

export const saveUsers = (users: User[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('eduscan_users', JSON.stringify(users));
    window.dispatchEvent(new Event('storage'));
  }
};

export const getAttendanceRecords = (): AttendanceRecord[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('eduscan_attendance_records');
  return stored ? JSON.parse(stored) : [];
};

export const saveAttendanceRecords = (records: AttendanceRecord[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('eduscan_attendance_records', JSON.stringify(records));
  }
};

export const markManualAttendance = (records: Omit<AttendanceRecord, 'id'>[]) => {
  const currentRecords = getAttendanceRecords();
  const newRecordsWithIds = records.map(r => ({ ...r, id: Math.random().toString(36).substr(2, 9) }));
  const updatedRecords = [...currentRecords, ...newRecordsWithIds];
  saveAttendanceRecords(updatedRecords);

  // Update rates for all involved students
  const users = getStoredUsers();
  const uniqueStudentIds = Array.from(new Set(records.map(r => r.studentId)));
  
  uniqueStudentIds.forEach(studentId => {
    const userIdx = users.findIndex(u => u.id === studentId);
    if (userIdx !== -1) {
      const studentRecords = updatedRecords.filter(r => r.studentId === studentId);
      const presentCount = studentRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
      const totalCount = studentRecords.length;
      users[userIdx].attendanceRate = Math.round((presentCount / totalCount) * 100);
    }
  });
  saveUsers(users);
};

export const recordScanAttendance = (data: {
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  faculty: string;
  semester: number;
}) => {
  const records = getAttendanceRecords();
  const today = new Date().toISOString().split('T')[0];
  
  // Prevent duplicate scans for the same subject on the same day
  const alreadyMarked = records.find(r => 
    r.studentId === data.studentId && 
    r.subjectId === data.subjectId && 
    r.date === today
  );
  
  if (alreadyMarked) return false;

  const newRecord: AttendanceRecord = {
    id: Math.random().toString(36).substr(2, 9),
    studentId: data.studentId,
    studentName: data.studentName,
    subjectId: data.subjectId,
    subjectName: data.subjectName,
    faculty: data.faculty,
    semester: data.semester,
    section: "A", // Default or extracted
    date: today,
    status: 'Present',
    markedBy: 'QR Scanner',
    timestamp: new Date().toISOString()
  };

  const updatedRecords = [...records, newRecord];
  saveAttendanceRecords(updatedRecords);

  // Update student rate
  const users = getStoredUsers();
  const userIdx = users.findIndex(u => u.id === data.studentId);
  if (userIdx !== -1) {
    const studentRecords = updatedRecords.filter(r => r.studentId === data.studentId);
    const presentCount = studentRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
    const totalCount = studentRecords.length;
    users[userIdx].attendanceRate = Math.round((presentCount / totalCount) * 100);
    saveUsers(users);
    
    // Update active session if necessary
    const session = localStorage.getItem('user_session');
    if (session) {
      const parsedSession = JSON.parse(session);
      if (parsedSession.id === data.studentId) {
        localStorage.setItem('user_session', JSON.stringify(users[userIdx]));
      }
    }
  }

  return true;
};

export const login = (userId: string, passwordInput: string, role: UserRole): User | null => {
  const users = getStoredUsers();
  const cleanId = userId.trim().toLowerCase();
  
  const user = users.find(u => 
    u.id.toLowerCase() === cleanId && u.password === passwordInput && u.role === role
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
