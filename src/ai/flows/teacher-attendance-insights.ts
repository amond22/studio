'use server';
/**
 * @fileOverview A Genkit flow for generating AI-powered attendance insights for teachers.
 * 
 * - teacherAttendanceInsights - A function that generates attendance insights.
 * - TeacherAttendanceInsightsInput - The input type for the teacherAttendanceInsights function.
 * - TeacherAttendanceInsightsOutput - The return type for the teacherAttendanceInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AttendanceRecordSchema = z.object({
  studentName: z.string().describe('The full name of the student.'),
  studentId: z.string().describe('The unique ID of the student.'),
  subject: z.string().describe('The subject for which attendance was recorded.'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('The date of the attendance record in YYYY-MM-DD format.'),
  time: z.string().regex(/^\d{2}:\d{2}$/).describe('The time of the attendance record in HH:MM (24-hour) format.'),
  status: z.enum(['Present', 'Absent', 'Late']).describe('The attendance status for the student.'),
});

const TeacherAttendanceInsightsInputSchema = z.object({
  attendanceRecords: z.array(AttendanceRecordSchema).describe('A list of attendance records for a class.'),
  teacherName: z.string().describe('The name of the teacher requesting the insights.'),
  classSubject: z.string().describe('The subject of the class for which insights are requested.'),
  timePeriod: z.string().describe('The time period these records cover, e.g., "last month", "this week".'),
});
export type TeacherAttendanceInsightsInput = z.infer<typeof TeacherAttendanceInsightsInputSchema>;

const AtRiskStudentSchema = z.object({
  studentName: z.string().describe('The full name of the identified at-risk student.'),
  studentId: z.string().describe('The unique ID of the at-risk student.'),
  issues: z.array(z.string()).describe('A list of specific attendance issues for this student, e.g., "Frequent Absences", "Consistent Lateness", "Absent on Mondays".'),
});

const TeacherAttendanceInsightsOutputSchema = z.object({
  summary: z.string().describe('A comprehensive summary of attendance patterns, highlighting overall trends and specific concerns.'),
  atRiskStudents: z.array(AtRiskStudentSchema).describe('A list of students identified as at-risk due to unusual attendance patterns or lateness.'),
});
export type TeacherAttendanceInsightsOutput = z.infer<typeof TeacherAttendanceInsightsOutputSchema>;

export async function teacherAttendanceInsights(input: TeacherAttendanceInsightsInput): Promise<TeacherAttendanceInsightsOutput> {
  return teacherAttendanceInsightsFlow(input);
}

const attendanceInsightsPrompt = ai.definePrompt({
  name: 'attendanceInsightsPrompt',
  input: { schema: TeacherAttendanceInsightsInputSchema },
  output: { schema: TeacherAttendanceInsightsOutputSchema },
  prompt: `You are an expert educational assistant specializing in attendance analysis. Your task is to review attendance records for a class and identify students with unusual absence patterns or consistent lateness.\n\nTeacher: {{{teacherName}}}\nSubject: {{{classSubject}}}\nTime Period: {{{timePeriod}}}\n\nHere are the attendance records:\n{{#each attendanceRecords}}\n- Student: {{this.studentName}} (ID: {{this.studentId}}), Subject: {{this.subject}}, Date: {{this.date}}, Time: {{this.time}}, Status: {{this.status}}\n{{/each}}\n\nAnalyze the provided attendance records and generate a summary of attendance patterns. Specifically, look for:\n- Overall attendance trends (e.g., average attendance, days with lowest/highest attendance).\n- Students with frequent absences (e.g., more than 2 absences in the period).\n- Students with consistent lateness (e.g., late more than 3 times).\n- Any unusual patterns (e.g., absent every Monday, consistently absent for specific subjects).\n\nBased on your analysis, identify individual students who appear to be at-risk due to their attendance and list their specific issues.\n\nEnsure the output is a JSON object matching the following schema, including both a 'summary' string and an 'atRiskStudents' array.`,
});

const teacherAttendanceInsightsFlow = ai.defineFlow(
  {
    name: 'teacherAttendanceInsightsFlow',
    inputSchema: TeacherAttendanceInsightsInputSchema,
    outputSchema: TeacherAttendanceInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await attendanceInsightsPrompt(input);
    return output!;
  }
);
