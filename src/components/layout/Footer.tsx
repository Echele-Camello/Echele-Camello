import React from 'react';
import { ShieldCheck, Lock, FileCheck } from 'lucide-react';

interface FooterProps {
  onOpenPrivacyTerms?: () => void;
  onOpenEscrowInfo?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacyTerms, onOpenEscrowInfo }) => {
  return (
    <footer className="w-full bg-[#000710] text-white pt-16 pb-12 border-t border-[#15191e]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* Top brand & trust statement */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#ff5900] rounded-sm flex items-center justify-center text-white text-xs font-black">
                EC
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Échele Camello</span>
            </div>
            <p className="text-xs text-[#8b8d98] leading-relaxed max-w-xs">
              Plataforma de contratación segura para oficios y trabajos informales en Colombia. Custodia de pagos (escrow), ofertas formales y verificación rigurosa de identidad.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#8b8d98]">
              <ShieldCheck className="w-4 h-4 text-[#ff5900]" />
              <span>Conforme a Ley 1581 de 2012 (Habeas Data)</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Plataforma & Seguridad</h4>
            <ul className="space-y-2.5 text-xs text-[#8b8d98]">
              <li>
                <button onClick={onOpenEscrowInfo} className="hover:text-white transition-colors cursor-pointer text-left">
                  Mecanismo de Escrow (Custodia)
                </button>
              </li>
              <li>
                <span className="text-white/60">Pasarela de Pagos (Wompi / PSE / Nequi)</span>
              </li>
              <li>
                <span className="text-white/60">Verificación de Cédula & Selfie</span>
              </li>
              <li>
                <span className="text-white/60">Resolución de Disputas en 5 días</span>
              </li>
              <li>
                <span className="text-white/60">Garantía de reembolso automático</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Categorías Populares</h4>
            <ul className="space-y-2.5 text-xs text-[#8b8d98]">
              <li><span>Plomería y Destapes a Domicilio</span></li>
              <li><span>Aseo Doméstico y Desinfección</span></li>
              <li><span>Electricidad Certificada</span></li>
              <li><span>Pintura, Drywall y Enchapes</span></li>
              <li><span>Acarreos Urbanos y Mudanzas</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Marco Legal & Soporte</h4>
            <ul className="space-y-2.5 text-xs text-[#8b8d98]">
              <li>
                <button onClick={onOpenPrivacyTerms} className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#ff5900]" />
                  <span>Política de Tratamiento de Datos</span>
                </button>
              </li>
              <li>
                <span className="text-white/60">Términos del Servicio de Intermediación</span>
              </li>
              <li>
                <span className="text-white/60">Privacidad: Datos ocultos en API pública (RF-05)</span>
              </li>
              <li>
                <span className="text-white/60">Línea de soporte: contacto@echelecamello.co</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & SRS metadata */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8b8d98]">
          <div className="flex items-center gap-3">
            <span>© 2026 Échele Camello S.A.S. Todos los derechos reservados.</span>
            <span>·</span>
            <span>Bogotá D.C., Colombia</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#60646c]">
            <span>Estándar IEEE 830 v2.0</span>
            <span>·</span>
            <span>Comisión plataforma 10% fija</span>
            <span>·</span>
            <span className="text-[#ff5900]">Arquitectura API-First</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
