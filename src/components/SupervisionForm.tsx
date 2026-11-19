import React from 'react';
import { Language, translations } from '@/src/lib/i18n';

interface SupervisionFormProps {
  lang: Language;
}

const FORM_URLS: Record<Language, string> = {
  th: 'https://docs.google.com/forms/d/e/1FAIpQLSdqy67N_cUIdoAMS0bSsERmMVwnuUcblX9M3kCyjKPlk8zOdw/viewform?embedded=true',
  en: 'https://docs.google.com/forms/d/e/1FAIpQLSc35vk2nfMKXV5OmTfAOs2pz5o_0Lwyr8BKWkcwu5qYOvCV-A/viewform?embedded=true',
};

export default function SupervisionForm({ lang }: SupervisionFormProps) {
  const t = translations[lang].form;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{t.title}</h2>
        <p className="text-sm sm:text-base text-slate-500">{t.subtitle}</p>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[calc(100dvh-13rem)] min-h-[520px] md:h-[800px]">
        <iframe
          key={lang}
          src={FORM_URLS[lang]}
          className="w-full h-full border-0"
          marginHeight={0}
          marginWidth={0}
          title={t.title}
        >
          {t.loading}
        </iframe>
      </div>
    </div>
  );
}
