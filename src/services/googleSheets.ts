export interface SupervisionRecord {
  timestamp: string;
  date: string;
  supervisor: string;
  teacher: string;
  level: string;
  round: string;
  // Scores
  objectiveScore: number;
  contentScore: number;
  activityScore: number;
  mediaScore: number;
  evaluationScore: number;
  // Activity phases
  introScore: number;
  teachingScore: number;
  conclusionScore: number;
  // Calculated
  averageScore: number;
}

const SHEET_ID = '1D8fic9UPVys93wxSVOlC0aIyNdTzxlFJtq27MMR6jc0';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

export async function fetchSupervisionData(): Promise<SupervisionRecord[]> {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    
    // The response is wrapped in a callback function, we need to extract the JSON
    const jsonData = JSON.parse(text.substring(47, text.length - 2));
    const rows = jsonData.table.rows;
    
    return rows.map((row: any) => {
      const c = row.c;
      
      // Mapping columns based on the user's request and typical Google Form output
      // Note: We might need to adjust indices if the sheet structure is different
      // Assuming: 0: Timestamp, 1: Date, 2: Supervisor, 3: Teacher, 4: Level, 5: Round, 
      // 6: Objective, 7: Content, 8: Activity, 9: Media, 10: Evaluation,
      // 11: Intro, 12: Teaching, 13: Conclusion
      
      const getValue = (index: number) => c[index]?.v ?? 0;
      const getString = (index: number) => c[index]?.v?.toString() ?? '';

      const objective = Number(getValue(6));
      const content = Number(getValue(7));
      const activity = Number(getValue(8));
      const media = Number(getValue(9));
      const evaluation = Number(getValue(10));
      
      const avg = (objective + content + activity + media + evaluation) / 5;

      return {
        timestamp: getString(0),
        date: getString(1),
        supervisor: getString(2),
        teacher: getString(3),
        level: getString(4),
        round: getString(5),
        objectiveScore: objective,
        contentScore: content,
        activityScore: activity,
        mediaScore: media,
        evaluationScore: evaluation,
        introScore: Number(getValue(11)),
        teachingScore: Number(getValue(12)),
        conclusionScore: Number(getValue(13)),
        averageScore: avg
      };
    });
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    return [];
  }
}
