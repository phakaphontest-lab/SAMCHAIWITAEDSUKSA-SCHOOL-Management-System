export interface SupervisionData {
  timestamp: string;
  date: string;
  supervisor: string;
  teacher: string;
  subject: string;
  gradeLevel: string;
  round: string;
  // Evaluation Areas (1-5 or similar)
  objectiveScore: number;
  contentScore: number;
  activityScore: number;
  mediaScore: number;
  evaluationScore: number;
  // Activity Phases
  introScore: number;
  teachingScore: number;
  summaryScore: number;
  // Overall
  totalScore: number;
  averageScore: number;
  comments: string;
}

export type TabType = 'form' | 'history' | 'data' | 'details' | 'overview';
