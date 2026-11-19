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

const THAI_SHEET_ID = '1D8fic9UPVys93wxSVOlC0aIyNdTzxlFJtq27MMR6jc0';
const ENGLISH_CSV_PATH = '/assets/aistudio/Teaching_Supervision_Form______________f0b2918c';
const ENGLISH_SHEET_STORAGE_KEY = 'english_supervision_sheet_url';

export function parseGoogleSheetUrl(input: string): { sheetId: string; gid?: string } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const idMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!idMatch) return null;

  const gidMatch = trimmed.match(/[?#&]gid=(\d+)/);
  return {
    sheetId: idMatch[1],
    gid: gidMatch?.[1],
  };
}

export function getSavedEnglishSheetUrl(): string {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(ENGLISH_SHEET_STORAGE_KEY) ?? '';
}

export function saveEnglishSheetUrl(url: string): void {
  if (typeof window === 'undefined') return;
  const trimmed = url.trim();
  if (trimmed) {
    window.localStorage.setItem(ENGLISH_SHEET_STORAGE_KEY, trimmed);
  } else {
    window.localStorage.removeItem(ENGLISH_SHEET_STORAGE_KEY);
  }
}

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

  // Skip completely empty rows
  if (!supervisor && !teacher && !date) return null;

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
  // English sheet/CSV: 5.1, 5.2, 5.3 (cols 20, 21, 22)
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

function parseCsvRows(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\r' && nextChar === '\n') {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
        i++;
      } else if (char === '\n' || char === '\r') {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

async function fetchFromGvizSheet(
  sheetId: string,
  gid: string | undefined,
  hasThirdEvalItem: boolean
): Promise<SupervisionRecord[]> {
  const gidParam = gid ? `&gid=${gid}` : '';
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json${gidParam}`;
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
}

async function fetchFromEnglishCsv(): Promise<SupervisionRecord[]> {
  const response = await fetch(ENGLISH_CSV_PATH);
  if (!response.ok) return [];
  const csvText = await response.text();
  const parsedRows = parseCsvRows(csvText);

  if (parsedRows.length <= 1) return [];

  // Skip header row (index 0)
  return parsedRows
    .slice(1)
    .map((row) => {
      const cells = row.map((value) => ({ v: value, f: value }));
      return mapRowValues(cells, true);
    })
    .filter((record): record is SupervisionRecord => record !== null);
}

export async function fetchSupervisionData(lang: Language = 'th'): Promise<SupervisionRecord[]> {
  try {
    if (lang === 'en') {
      const savedUrl = getSavedEnglishSheetUrl();
      const parsed = parseGoogleSheetUrl(savedUrl);
      if (parsed) {
        return await fetchFromGvizSheet(parsed.sheetId, parsed.gid, true);
      }
      return await fetchFromEnglishCsv();
    }

    return await fetchFromGvizSheet(THAI_SHEET_ID, undefined, false);
  } catch (error) {
    console.error('Error fetching supervision data:', error);
    return [];
  }
}
