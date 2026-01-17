
import React, { useState, useRef } from 'react';
import { UI_STRINGS } from '../constants';

interface ScannerProps {
  onCapture: (base64: string) => void;
  isAnalyzing: boolean;
  lang: 'en' | 'ar' | 'fr';
}

const Scanner: React.FC<ScannerProps> = ({ onCapture, isAnalyzing, lang }) => {
  const t = UI_STRINGS[lang];
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onCapture(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="relative w-full aspect-square max-w-sm overflow-hidden rounded-3xl bg-slate-200 border-4 border-white shadow-xl flex items-center justify-center group">
        {preview ? (
          <img src={preview} alt="Food preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-8 text-slate-400">
            <i className="fas fa-camera text-6xl mb-4 animate-pulse"></i>
            <p className="text-sm font-medium">{t.positionFrame}</p>
          </div>
        )}
        
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-6 text-center">
            <i className="fas fa-dna text-4xl mb-4 animate-spin text-emerald-400"></i>
            <p className="font-bold text-lg mb-2">{t.aiAnalyzing}</p>
            <p className="text-xs opacity-80">{t.enhancingImage}</p>
          </div>
        )}

        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <button 
            onClick={triggerUpload}
            disabled={isAnalyzing}
            className="bg-emerald-500 text-white h-16 w-16 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-transform active:scale-95 disabled:opacity-50"
          >
            <i className="fas fa-plus text-2xl"></i>
          </button>
        </div>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-800">{t.scanFood}</h3>
        <p className="text-slate-500 max-w-xs mx-auto text-sm">{t.scanLabelHint}</p>
      </div>
    </div>
  );
};

export default Scanner;
