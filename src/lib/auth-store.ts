"use client";

/**
 * @fileOverview Centralized Data Persistence Layer for EduScan.
 * Handles Users, Subjects, Faculties, and Attendance using LocalStorage.
 */

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

export interface Subject {
  id: string;
  code: string;
  name: string;
  faculty: string;
  semester: number;
  teacherId?: string;
  teacherName?: string;
}

export interface Faculty {
  id: string;
  name: string;
  longName: string;
  semesters: number;
  subjects: number;
}

export interface NetworkSettings {
  restrictionEnabled: boolean;
  wifiSsid: string;
  ipRangeStart: string;
  ipRangeEnd: string;
}

const DEFAULT_LOGO = "https://picsum.photos/seed/edu1/200/200";

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

const DEFAULT_FACULTIES: Faculty[] = [
  { id: "BIT", name: "BIT", longName: "Bachelor of Information Technology", semesters: 8, subjects: 42 },
  { id: "BBA", name: "BBA", longName: "Bachelor of Business Administration", semesters: 8, subjects: 38 },
  { id: "BHM", name: "BHM", longName: "Bachelor of Hotel Management", semesters: 8, subjects: 35 },
];

const DEFAULT_SUBJECTS: Subject[] = [
  { id: "1", code: "BIT-401", name: "Cloud Computing", faculty: "BIT", semester: 7, teacherName: "Dr. Robert Smith", teacherId: "teacher" },
  { id: "2", code: "BIT-302", name: "Database Systems", faculty: "BIT", semester: 5, teacherName: "Dr. Robert Smith", teacherId: "teacher" },
  { id: "3", code: "BBA-201", name: "Microeconomics", faculty: "BBA", semester: 3, teacherName: "Unassigned" },
];

const DEFAULT_NETWORK_SETTINGS: NetworkSettings = {
  restrictionEnabled: true,
  wifiSsid: "Balmiki_Lincoln_WiFi",
  ipRangeStart: "192.168.1.1",
  ipRangeEnd: "192.168.1.255"
};

const isClient = typeof window !== 'undefined';

export function getStoredUsers(): User[] {
  if (!isClient) return DEFAULT_USERS;
  const stored = localStorage.getItem('eduscan_users');
  if (!stored) {
    localStorage.setItem('eduscan_users', JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  try { return JSON.parse(stored); } catch (e) { return DEFAULT_USERS; }
}

export function saveUsers(users: User[]) {
  if (isClient) {
    localStorage.setItem('eduscan_users', JSON.stringify(users));
    window.dispatchEvent(new Event('storage'));
  }
}

export function getStoredFaculties(): Faculty[] {
  if (!isClient) return DEFAULT_FACULTIES;
  const stored = localStorage.getItem('eduscan_faculties');
  if (!stored) {
    localStorage.setItem('eduscan_faculties', JSON.stringify(DEFAULT_FACULTIES));
    return DEFAULT_FACULTIES;
  }
  try { return JSON.parse(stored); } catch (e) { return DEFAULT_FACULTIES; }
}

export function saveFaculties(faculties: Faculty[]) {
  if (isClient) {
    localStorage.setItem('eduscan_faculties', JSON.stringify(faculties));
    window.dispatchEvent(new Event('storage'));
  }
}

export function getStoredSubjects(): Subject[] {
  if (!isClient) return DEFAULT_SUBJECTS;
  const stored = localStorage.getItem('eduscan_subjects');
  if (!stored) {
    localStorage.setItem('eduscan_subjects', JSON.stringify(DEFAULT_SUBJECTS));
    return DEFAULT_SUBJECTS;
  }
  try { return JSON.parse(stored); } catch (e) { return DEFAULT_SUBJECTS; }
}

export function saveSubjects(subjects: Subject[]) {
  if (isClient) {
    localStorage.setItem('eduscan_subjects', JSON.stringify(subjects));
    window.dispatchEvent(new Event('storage'));
  }
}

export function getCollegeLogo(): string {
  if (!isClient) return DEFAULT_LOGO;
  return localStorage.getItem('eduscan_college_logo') || DEFAULT_LOGO;
}

export function setCollegeLogo(url: string) {
  if (isClient) {
    localStorage.setItem('eduscan_college_logo', url);
    window.dispatchEvent(new Event('storage'));
  }
}

export function getNetworkSettings(): NetworkSettings {
  if (!isClient) return DEFAULT_NETWORK_SETTINGS;
  const stored = localStorage.getItem('eduscan_network_settings');
  if (!stored) return DEFAULT_NETWORK_SETTINGS;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_NETWORK_SETTINGS;
  }
}

export function saveNetworkSettings(settings: NetworkSettings) {
  if (isClient) {
    localStorage.setItem('eduscan_network_settings', JSON.stringify(settings));
    window.dispatchEvent(new Event('storage'));
  }
}

export function getAttendanceRecords(): AttendanceRecord[] {
  if (!isClient) return [];
  const stored = localStorage.getItem('eduscan_attendance_records');
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

export function saveAttendanceRecords(records: AttendanceRecord[]) {
  if (isClient) {
    localStorage.setItem('eduscan_attendance_records', JSON.stringify(records));
    window.dispatchEvent(new Event('storage'));
  }
}

export function markManualAttendance(records: Omit<AttendanceRecord, 'id'>[]) {
  const currentRecords = getAttendanceRecords();
  const newRecordsWithIds = records.map(r => ({ ...r, id: Math.random().toString(36).substring(2, 9) }));
  const updatedRecords = [...currentRecords, ...newRecordsWithIds];
  saveAttendanceRecords(updatedRecords);

  const users = getStoredUsers();
  const uniqueStudentIds = Array.from(new Set(records.map(r => r.studentId)));
  
  uniqueStudentIds.forEach(studentId => {
    const userIdx = users.findIndex(u => u.id === studentId);
    if (userIdx !== -1) {
      const studentRecords = updatedRecords.filter(r => r.studentId === studentId);
      const presentCount = studentRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
      const totalCount = studentRecords.length;
      users[userIdx].attendanceRate = Math.round((presentCount / (totalCount || 1)) * 100);
    }
  });
  saveUsers(users);
}

export function recordScanAttendance(data: {
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  faculty: string;
  semester: number;
}) {
  const records = getAttendanceRecords();
  const today = new Date().toISOString().split('T')[0];
  
  const alreadyMarked = records.find(r => 
    r.studentId === data.studentId && 
    r.subjectId === data.subjectId && 
    r.date === today
  );
  
  if (alreadyMarked) return false;

  const newRecord: AttendanceRecord = {
    id: Math.random().toString(36).substring(2, 9),
    studentId: data.studentId,
    studentName: data.studentName,
    subjectId: data.subjectId,
    subjectName: data.subjectName,
    faculty: data.faculty,
    semester: data.semester,
    section: "A",
    date: today,
    status: 'Present',
    markedBy: 'QR Scanner',
    timestamp: new Date().toISOString()
  };

  const updatedRecords = [...records, newRecord];
  saveAttendanceRecords(updatedRecords);

  const users = getStoredUsers();
  const userIdx = users.findIndex(u => u.id === data.studentId);
  if (userIdx !== -1) {
    const studentRecords = updatedRecords.filter(r => r.studentId === data.studentId);
    const presentCount = studentRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
    const totalCount = studentRecords.length;
    users[userIdx].attendanceRate = Math.round((presentCount / (totalCount || 1)) * 100);
    saveUsers(users);
    
    const session = localStorage.getItem('user_session');
    if (session) {
      const parsedSession = JSON.parse(session);
      if (parsedSession.id === data.studentId) {
        localStorage.setItem('user_session', JSON.stringify(users[userIdx]));
      }
    }
  }

  return true;
}

export function login(userId: string, passwordInput: string, role: UserRole): User | null {
  const users = getStoredUsers();
  const cleanId = userId.trim().toLowerCase();
  const cleanPw = passwordInput.trim(); 
  
  const user = users.find(u => 
    u.id.toLowerCase() === cleanId && 
    (u.password || "") === cleanPw && 
    u.role === role
  );

  if (user) {
    if (isClient) {
      localStorage.setItem('user_session', JSON.stringify(user));
    }
    return user;
  }
  return null;
}

export function getCurrentUser(): User | null {
  if (!isClient) return null;
  const session = localStorage.getItem('user_session');
  return session ? JSON.parse(session) : null;
}

export function logout() {
  if (isClient) {
    localStorage.removeItem('user_session');
  }
}

export function updateUserProfile(updatedData: Partial<User>): User | null {
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
}