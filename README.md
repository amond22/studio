# EduScan Attend - Balmiki Lincoln College

This is a modern, AI-powered Student Attendance Management System.

## ⚡ Quick Start (Run in VS Code)

1. **Open the Correct Folder**: In VS Code, go to `File > Open Folder...` and select the **root folder** of this project (the one containing `package.json`).
2. **Open Terminal**: Press `Ctrl + ~` (or `Cmd + ~` on Mac).
3. **Verify your location**: Type `ls` (on Mac/Linux) or `dir` (on Windows). 
   - **Crucial**: If you do NOT see `package.json` in the list, you are in the wrong folder.
   - Look for a folder name in the list, then type `cd folder-name` and press Enter.
4. **Install Dependencies**: Once you are in the folder where `package.json` exists, type:
   ```bash
   npm install
   ```
5. **Run the App**: Type:
   ```bash
   npm run dev
   ```
6. **Open in Browser**: Go to `http://localhost:9002`.

## 🛠 Troubleshooting: "ENOENT: no such file or directory"
If you see an error saying `package.json` cannot be found:
- This means your terminal is at `C:\Users\Manoj Gupta\Downloads\studio-main` but the actual files are likely one level deeper (e.g., `C:\Users\Manoj Gupta\Downloads\studio-main\eduscan-app`).
- **The Fix**: Type `dir` to see the folders. If you see a folder name, type `cd folder-name`. Then try `npm install` again.

## 🔑 Default Credentials

- **Admin Portal**: ID: `admin` | PW: `admin-password`
- **Teacher Portal**: ID: `teacher` | PW: `teacher-password`
- **Student Portal**: ID: `student` | PW: `student-password`

## 📦 Deployment
This project is built with Next.js and is ready for **Firebase App Hosting**. Simply push to GitHub and connect your repository for a live production URL.
