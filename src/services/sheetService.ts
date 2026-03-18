import Papa from 'papaparse';
import { SupervisionData } from '../types';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/117U2AWnItcYFY3FtBlut7Vk6NIh-mr3SjorNu4_aecc/export?format=csv';

export async function fetchSupervisionData(): Promise<SupervisionData[]> {
  try {
    const response = await fetch(SHEET_URL);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data.map((row: any) => {
            // Mapping based on common Google Form response headers in Thai
            // We'll need to be flexible or map them to our interface
            // Since I can't see the exact headers, I'll try to map common patterns
            // or use index-based mapping if headers are complex.
            
            // Expected headers (Thai):
            // ประทับเวลา, วันที่นิเทศ, ชื่อ-นามสกุล ผู้นิเทศ, ชื่อ-นามสกุล ครูผู้รับการนิเทศ, วิชาที่สอน, ระดับชั้น, ครั้งที่นิเทศ
            // 1. ด้านจุดประสงค์..., 2. ด้านเนื้อหา..., 3. ด้านกิจกรรม..., 4. ด้านสื่อ..., 5. ด้านการวัดผล...
            // ขั้นนำ, ขั้นสอน, ขั้นสรุป
            
            const keys = Object.keys(row);
            
            const getVal = (pattern: string) => {
              const key = keys.find(k => k.includes(pattern));
              return key ? row[key] : '';
            };

            const getNum = (pattern: string) => {
              const val = getVal(pattern);
              return parseFloat(val) || 0;
            };

            return {
              timestamp: row[keys[0]] || '',
              date: getVal('วันที่นิเทศ') || row[keys[1]] || '',
              supervisor: getVal('ผู้นิเทศ') || '',
              teacher: getVal('ครูผู้รับการนิเทศ') || '',
              subject: getVal('วิชา') || '',
              gradeLevel: getVal('ระดับชั้น') || '',
              round: getVal('ครั้งที่') || '',
              objectiveScore: getNum('จุดประสงค์') || getNum('เป้าหมาย'),
              contentScore: getNum('เนื้อหา'),
              activityScore: getNum('กิจกรรมการจัดการเรียนรู้'),
              mediaScore: getNum('สื่อการเรียนรู้'),
              evaluationScore: getNum('การวัดและประเมินผล'),
              introScore: getNum('ขั้นนำ'),
              teachingScore: getNum('ขั้นสอน'),
              summaryScore: getNum('ขั้นสรุป'),
              totalScore: 0, // Calculated below
              averageScore: 0, // Calculated below
              comments: getVal('ข้อเสนอแนะ') || ''
            };
          });

          // Calculate averages
          const processedData = data.map(item => {
            const areaScores = [item.objectiveScore, item.contentScore, item.activityScore, item.mediaScore, item.evaluationScore];
            const total = areaScores.reduce((a, b) => a + b, 0);
            return {
              ...item,
              totalScore: total,
              averageScore: total / areaScores.length
            };
          });

          resolve(processedData);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return [];
  }
}
