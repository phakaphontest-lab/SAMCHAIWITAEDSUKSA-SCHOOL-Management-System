import React, { useState } from 'react';
import { Link2, CheckCircle2, RotateCcw } from 'lucide-react';
import { Language, translations } from '@/src/lib/i18n';
import {
  getSavedEnglishSheetUrl,
  parseGoogleSheetUrl,
  saveEnglishSheetUrl,
} from '@/src/services/googleSheets';

interface EnglishSheetConnectProps {
  lang: Language;
  onSheetConnected: () => void;
}

export default function EnglishSheetConnect({ lang, onSheetConnected }: EnglishSheetConnectProps) {
  const t = translations[lang].englishSheet;
  const savedUrl = getSavedEnglishSheetUrl();
  const [urlInput, setUrlInput] = useState(savedUrl);
  const [error, setError] = useState('');

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseGoogleSheetUrl(urlInput);
    if (!parsed) {
      setError(t.invalidUrl);
      return;
    }
    setError('');
    saveEnglishSheetUrl(urlInput);
    onSheetConnected();
  };

  const handleReset = () => {
    setUrlInput('');
    setError('');
    saveEnglishSheetUrl('');
    onSheetConnected();
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8 max-w-2xl mx-auto text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
        <Link2 className="w-6 h-6" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-bold text-slate-800">{t.noDataTitle}</h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{t.noDataDesc}</p>
      </div>

      <form onSubmit={handleConnect} className="space-y-3 pt-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => {
            setUrlInput(e.target.value);
            if (error) setError('');
          }}
          placeholder={t.placeholder}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-emerald-700 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            {t.connectBtn}
          </button>
          {savedUrl && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {t.resetBtn}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
