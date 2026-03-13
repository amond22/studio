# EduScan Attend - Balmiki Lincoln College

This is a modern, AI-powered Student Attendance Management System built with Next.js, React, and Tailwind CSS.

## 🚀 Taking it "Live" (Deployment)

Since this is a Next.js application (built on Node.js), it is designed to be hosted on the web easily. You are not stuck on localhost!

### Option 1: Firebase App Hosting (Recommended)
This project is already configured with `apphosting.yaml`. 
1. Push your code to a GitHub repository.
2. Connect your repository to [Firebase App Hosting](https://firebase.google.com/docs/app-hosting).
3. It will automatically build and provide you with a live URL (e.g., `eduscan.web.app`).

### Option 2: Manual Node.js Server
If you want to run this on your own Node.js server:
1. Run `npm run build` to create a production-ready version.
2. Run `npm start` to launch the live server on port 3000.

## 🛠 Features
- **Admin Portal**: Manage users, subjects, faculties, and branding.
- **Teacher Dashboard**: Generate dynamic QR codes for attendance.
- **Student Portal**: Live QR scanning with instant feedback.
- **AI Insights**: GenAI-powered analysis of attendance patterns.
- **Persistence**: All data is saved in LocalStorage, so it stays even if you close the browser.

## 📦 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS & ShadCN UI
- **AI**: Google Genkit (Gemini 2.5 Flash)
- **Icons**: Lucide React
