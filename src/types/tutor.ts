export type LessonMode = "대면" | "온라인" | "하이브리드";

export interface TutorProfile {
  id: string;
  name: string;
  subject: string;
  region: string;
  mode: LessonMode;
  hourlyRate: number;
  experienceYears: number;
  rating: number;
  intro: string;
  tags: string[];
}
