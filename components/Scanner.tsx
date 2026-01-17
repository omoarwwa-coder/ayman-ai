
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
      <div className="relative w-full aspect-square max-w-sm overflow-hidden rounded-[40px] bg-slate-200 border-4 border-white shadow-2xl flex items-center justify-center group">
        {preview ? (
          <img src={preview} alt="Food preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-8 text-slate-400">
            <i className="fas fa-camera text-6xl mb-4 animate-float"></i>
            <p className="text-sm font-semibold">{t.positionFrame}</p>
          </div>
        )}
        
        {isAnalyzing && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center animate-in fade-in duration-300">
            <div className="relative">
              <i className="fas fa-dna text-5xl mb-4 animate-spin text-emerald-400"></i>
              <i className="fas fa-search absolute -top-1 -right-1 text-white text-xs"></i>
            </div>
            <p className="font-black text-xl mb-2">{t.aiAnalyzing}</p>
            <p className="text-xs opacity-70 max-w-[200px]">{t.enhancingImage}</p>
          </div>
        )}

        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <button 
            onClick={triggerUpload}
            disabled={isAnalyzing}
            className="bg-emerald-500 text-white h-20 w-20 rounded-full flex items-center justify-center shadow-xl shadow-emerald-200 hover:bg-emerald-600 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 border-4 border-white"
          >
            <i className="fas fa-camera-retro text-2xl"></i>
          </button>
        </div>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
        capture="environment"
      />

      <div className="text-center px-4">
        <h3 className="text-2xl font-black text-slate-800 mb-2">{t.scanFood}</h3>
        <p className="text-slate-500 text-sm font-medium leading-relaxed">{t.scanLabelHint}</p>
      </div>
    </div>
  );
};

export default Scanner;
