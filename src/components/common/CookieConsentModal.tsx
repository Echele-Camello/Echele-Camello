import React, { useState, useEffect } from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface CookieConsentModalProps {
  onLearnMore?: () => void;
}

export const CookieConsentModal: React.FC<CookieConsentModalProps> = ({ onLearnMore }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('echele_camello_consent_ley1581');
    if (!consent) {
      // Dwell before showing as per DESIGN.md & UX principles
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('echele_camello_consent_ley1581', JSON.stringify({
      accepted: true,
      timestamp: new Date().toISOString(),
      version: 'v2.0-Ley1581'
    }));
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('echele_camello_consent_ley1581', JSON.stringify({
      accepted: false,
      timestamp: new Date().toISOString(),
      version: 'v2.0-Ley1581'
    }));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[480px]">
      <div className="bg-white border border-[#b9bbc6] rounded-[12px] p-5 shadow-lg">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-1.5 bg-[#f3f3f7] rounded-[6px] shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#ff5900]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-black tracking-tight">
              Protección de Datos Personales (Ley 1581)
            </h3>
            <p className="text-xs text-[#60646c] mt-1 leading-relaxed">
              En Échele Camello tratamos tus datos de forma transparente. Protegemos tu número telefónico y dirección exacta bajo estrictos protocolos de privacidad (RF-05) y cookies técnicas esenciales.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#f3f3f7]">
          <button
            onClick={onLearnMore}
            className="text-xs text-[#000000] hover:underline font-medium cursor-pointer"
          >
            Ver términos
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReject}
              className="px-3 py-1.5 text-xs font-medium text-black border border-[#b9bbc6] rounded-[12px] hover:bg-[#f3f3f7] transition-colors cursor-pointer"
            >
              Rechazar no esenciales
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#ff5900] hover:bg-[#e04f00] rounded-[12px] transition-colors cursor-pointer"
            >
              Aceptar todo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
