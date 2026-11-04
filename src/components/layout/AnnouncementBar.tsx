import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface AnnouncementBarProps {
  onLearnMoreClick?: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onLearnMoreClick }) => {
  return (
    <aside aria-label="Aviso de seguridad y escrow" className="w-full bg-[#15191e] text-white py-1.5 px-4 text-xs font-medium border-b border-[#15191e]">
      <div className="max-w-[1200px] mx-auto flex items-center justify-center gap-2 text-center flex-wrap">
        <span className="flex items-center gap-1.5 text-white/90">
          <ShieldCheck className="w-3.5 h-3.5 text-[#ff5900]" />
          <span>Garantía de Escrow: tu dinero queda protegido en custodia hasta que el trabajo esté completado y aprobado.</span>
        </span>
        <button 
          onClick={onLearnMoreClick}
          className="text-[#ff5900] hover:underline font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer ml-1"
        >
          <span>Conoce cómo funciona</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
};
