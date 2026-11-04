import React from 'react';
import { Briefcase, ArrowRight } from 'lucide-react';

interface FloatingWorkerButtonProps {
  onClick: () => void;
}

export const FloatingWorkerButton: React.FC<FloatingWorkerButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 animate-fade-in">
      <button
        onClick={onClick}
        aria-label="¿Quieres ser contratado? Presiona aquí"
        className="bg-[#15191e] hover:bg-black text-white text-xs md:text-sm font-semibold px-4 md:px-5 py-3 rounded-[12px] border border-[#ff5900]/40 shadow-xl flex items-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
      >
        <div className="w-6 h-6 rounded-[6px] bg-[#ff5900] flex items-center justify-center text-white shrink-0">
          <Briefcase className="w-3.5 h-3.5" />
        </div>
        <div className="text-left">
          <span className="block text-white font-bold leading-tight">
            ¿Quieres ser contratado? Presiona aquí
          </span>
          <span className="text-[10px] text-[#ff5900] font-normal leading-tight hidden sm:block">
            Publica tu oficio y gana con pagos garantizados
          </span>
        </div>
        <ArrowRight className="w-4 h-4 text-[#ff5900] group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};
