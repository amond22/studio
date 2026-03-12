# **App Name**: EduScan Attend

## Core Features:

- User Authentication & Authorization: Provide a secure login and logout system for Admin, Teacher, and Student roles, ensuring appropriate access controls for each user type, including forgot password functionality and session protection.
- User Profile Management: Allow creation, viewing, and editing of comprehensive user profiles with specific fields for students (ID, faculty, semester) and teachers (ID, assigned subjects), including the ability to upload profile photos.
- Academic Structure Management (Admin): Admin users can define and manage faculties (e.g., BIT, BBA), structure them with semesters (1-8), add or delete subjects, and assign teachers to specific subjects.
- Dynamic QR Attendance Generation: Teachers can generate real-time, time-sensitive, and unique QR codes for their active classes. These QR codes expire automatically and enforce a 'one scan per student' policy for attendance recording.
- Student QR Attendance Scanner: Students can scan the generated QR codes using their device's camera (mobile or laptop webcam) through a built-in scanner to quickly mark their attendance.
- Network-Restricted Attendance: Implement a restriction that allows attendance to be marked only when students are connected to the college's designated WiFi network or within a pre-defined IP range, configurable by an Admin.
- Intelligent Attendance Overview (Teacher): An AI tool processes daily attendance records, flags students with unusual absence or lateness for specific classes, and generates tailored insights for teachers to identify at-risk students.

## Style Guidelines:

- The primary color is a deep, professional blue (#2E5CB8), conveying trust and stability, fitting for an educational institution. This color is versatile enough for headlines, important active elements, and branding.
- The background color is a heavily desaturated light blue (#EFF1F4). It creates a clean, airy canvas that gently ties into the primary color scheme, ensuring high readability for textual content and forms.
- The accent color is a muted dark teal (#126C7E). This color is analogous to the primary and offers a strong contrast, making it suitable for interactive elements like buttons, alerts, and key highlights without being overly bright.
- Headlines and prominent text will use 'Space Grotesk' (sans-serif) for its modern, tech-savvy, and structured aesthetic. Body text and longer content will utilize 'Inter' (sans-serif) for its high readability and objective appearance, ensuring clear communication across the application.
- Utilize modern, clean line icons that clearly represent their function without being overly complex. Prioritize clarity and consistency across all icon usage for intuitive navigation and data representation.
- Implement a responsive, dashboard-centric layout with a persistent sidebar for primary navigation. Key information and statistics will be displayed using a card-based system to enhance readability and organization on various screen sizes.
- Incorporate subtle, smooth transitions for page changes and component interactions using Framer Motion. All interactive buttons will feature modern hover effects such as slight zoom, smooth color transitions, and soft shadows, with a uniform duration of 0.3 seconds for a polished user experience.