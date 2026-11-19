import { Language } from '@/src/lib/i18n';

export interface SupervisionRecord {
  timestamp: string;
  date: string;
  dateTimestamp: number;
  supervisor: string;
  teacher: string;
  level: string;
  round: string;
  // Scores (5 aspects)
  objectiveScore: number;
  contentScore: number;
  activityScore: number;
  mediaScore: number;
  evaluationScore: number;
  // Activity phases (3.1-3.2, 3.3-3.6, 3.7)
  introScore: number;
  teachingScore: number;
  conclusionScore: number;
  // Calculated overall average across the 5 aspects
  averageScore: number;
}

const SHEET_CONFIG: Record<Language, { sheetId: string; hasThirdEvalItem: boolean }> = {
  th: {
    sheetId: '1D8fic9UPVys93wxSVOlC0aIyNdTzxlFJtq27MMR6jc0',
    hasThirdEvalItem: false,
  },
  en: {
    sheetId: '1KrH9wIPHbRo5ck_nD4Uil01c-UzK6x6Zh8f0dBcsIDQ',
    hasThirdEvalItem: true,
  },
};

function parseGvizDate(rawValue: unknown, formattedValue?: string): { display: string; timestamp: number } {
  if (typeof rawValue === 'string') {
    const gvizMatch = rawValue.match(/^Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+),(\d+))?\)$/);
    if (gvizMatch) {
      const year = Number(gvizMatch[1]);
      const month = Number(gvizMatch[2]); // 0-indexed in gviz Date(...)
      const day = Number(gvizMatch[3]);
      const dateObj = new Date(year, month, day);
      const display = formattedValue || `${day}/${month + 1}/${year}`;
      return { display, timestamp: dateObj.getTime() };
    }
  }

  const text = (formattedValue ?? rawValue?.toString() ?? '').trim();
  if (!text) return { display: '', timestamp: 0 };

  // Handle d/m/yyyy or dd/mm/yyyy
  const dmyMatch = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (dmyMatch) {
    const day = Number(dmyMatch[1]);
    const month = Number(dmyMatch[2]) - 1;
    let year = Number(dmyMatch[3]);
    // Convert Buddhist Era year if needed (e.g. 2569 -> 2026)
    if (year > 2400) year -= 543;
    const dateObj = new Date(year, month, day);
    return { display: text, timestamp: dateObj.getTime() };
  }

  const parsed = Date.parse(text);
  return {
    display: text,
    timestamp: Number.isNaN(parsed) ? 0 : parsed,
  };
}

function averageOf(values: number[]): number {
  const valid = values.filter((v) => !Number.isNaN(v) && v > 0);
  if (valid.length === 0) return 0;
  return valid.reduce((sum, v) => sum + v, 0) / valid.length;
}

function mapRowValues(
  cells: Array<{ v: unknown; f?: string }>,
  hasThirdEvalItem: boolean
): SupervisionRecord | null {
  const getString = (idx: number) => (cells[idx]?.f ?? cells[idx]?.v ?? '').toString().trim();
  const getNumber = (idx: number) => {
    const raw = cells[idx]?.v;
    if (raw === null || raw === undefined || raw === '') return NaN;
    const num = Number(raw);
    return Number.isNaN(num) ? NaN : num;
  };

  const supervisor = getString(2);
  const teacher = getString(3);
  const { display: date, timestamp: dateTimestamp } = parseGvizDate(cells[1]?.v, cells[1]?.f);

  // Skip empty rows or accidental header rows
  if (!supervisor && !teacher && !date) return null;
  if (
    (supervisor === 'Supervisor' && date === 'Date') ||
    (supervisor === 'ผู้นิเทศ' && date === 'วันที่นิเทศ')
  ) {
    return null;
  }

  // Aspect 1: Objectives (1.1, 1.2 -> cols 6, 7)
  const objectiveScore = averageOf([getNumber(6), getNumber(7)]);

  // Aspect 2: Content (2.1, 2.2, 2.3 -> cols 8, 9, 10)
  const contentScore = averageOf([getNumber(8), getNumber(9), getNumber(10)]);

  // Aspect 3: Learning Activities (3.1 - 3.7 -> cols 11..17)
  const activityScores = [
    getNumber(11),
    getNumber(12),
    getNumber(13),
    getNumber(14),
    getNumber(15),
    getNumber(16),
    getNumber(17),
  ];
  const activityScore = averageOf(activityScores);
  const introScore = averageOf([getNumber(11), getNumber(12)]); // 3.1 - 3.2
  const teachingScore = averageOf([getNumber(13), getNumber(14), getNumber(15), getNumber(16)]); // 3.3 - 3.6
  const conclusionScore = averageOf([getNumber(17)]); // 3.7

  // Aspect 4: Learning Media (4.1, 4.2 -> cols 18, 19)
  const mediaScore = averageOf([getNumber(18), getNumber(19)]);

  // Aspect 5: Assessment & Evaluation
  // Thai sheet: 5.1, 5.2 (cols 20, 21)
  // English sheet: 5.1, 5.2, 5.3 (cols 20, 21, 22)
  const evaluationScore = hasThirdEvalItem
    ? averageOf([getNumber(20), getNumber(21), getNumber(22)])
    : averageOf([getNumber(20), getNumber(21)]);

  const averageScore = averageOf([
    objectiveScore,
    contentScore,
    activityScore,
    mediaScore,
    evaluationScore,
  ]);

  return {
    timestamp: getString(0),
    date,
    dateTimestamp,
    supervisor,
    teacher,
    level: getString(4),
    round: getString(5),
    objectiveScore,
    contentScore,
    activityScore,
    mediaScore,
    evaluationScore,
    introScore,
    teachingScore,
    conclusionScore,
    averageScore,
  };
}

export async function fetchSupervisionData(lang: Language = 'th'): Promise<SupervisionRecord[]> {
  try {
    const { sheetId, hasThirdEvalItem } = SHEET_CONFIG[lang];
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&headers=1`;
    const response = await fetch(url);
    const text = await response.text();

    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    if (startIndex === -1 || endIndex === -1) {
      throw new Error('Unexpected Google Sheets response format');
    }

    const jsonData = JSON.parse(text.substring(startIndex, endIndex + 1));
    const rows = jsonData?.table?.rows ?? [];

    return rows
      .map((row: { c?: Array<{ v?: unknown; f?: string } | null> }) => {
        const cells = (row.c ?? []).map((cell) => ({
          v: cell?.v ?? '',
          f: cell?.f,
        }));
        return mapRowValues(cells, hasThirdEvalItem);
      })
      .filter((record: SupervisionRecord | null): record is SupervisionRecord => record !== null);
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    return [];
  }
}
