
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { UI_STRINGS } from '../constants';

interface NearbyPlacesProps {
  lang: string;
}

const NearbyPlaces: React.FC<NearbyPlacesProps> = ({ lang }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{text: string, links: any[]} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const t = UI_STRINGS[lang];

  useEffect(() => {
    const fetchPlaces = () => {
      if (!navigator.geolocation) {
        setError(t.locationError);
        return;
      }

      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const result = await geminiService.searchNearbyHealthyPlaces(
              position.coords.latitude,
              position.coords.longitude,
              lang
            );
            setData(result);
          } catch (err) {
            setError(t.locationError);
          } finally {
            setLoading(false);
          }
        },
        () => {
          setError(t.locationError);
          setLoading(false);
        }
      );
    };

    fetchPlaces();
  }, [lang]);

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center space-y-4 text-center py-20">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center animate-pulse">
          <i className="fas fa-map-marker-alt text-2xl"></i>
        </div>
        <p className="text-slate-500 font-medium">{t.findingNearby}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center py-20">
        <i className="fas fa-exclamation-circle text-rose-400 text-3xl mb-4"></i>
        <p className="text-slate-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 pb-24">
      <header className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
          <i className="fas fa-location-dot text-xl"></i>
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800">{t.nearbyHealthyPlaces}</h2>
          <p className="text-xs text-slate-400 font-medium">Healthy dining in your area</p>
        </div>
      </header>

      {data && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
            {data.text}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {data.links.map((link, idx) => (
              <a 
                key={idx}
                href={link.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
                    <i className="fas fa-directions"></i>
                  </div>
                  <span className="font-bold text-blue-700">{link.title}</span>
                </div>
                <i className="fas fa-external-link-alt text-blue-300 group-hover:text-blue-500 transition-colors"></i>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NearbyPlaces;
