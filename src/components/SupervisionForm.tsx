import React from 'react';

export default function SupervisionForm() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-800">การนิเทศการสอน</h2>
        <p className="text-slate-500">บันทึกข้อมูลการนิเทศผ่าน Google Form</p>
      </div>
      
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[800px]">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSdqy67N_cUIdoAMS0bSsERmMVwnuUcblX9M3kCyjKPlk8zOdw/viewform?embedded=true"
          width="100%"
          height="100%"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          title="Supervision Form"
        >
          กำลังโหลด…
        </iframe>
      </div>
    </div>
  );
}
