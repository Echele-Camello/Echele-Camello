import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, ArrowRight, Lock, DollarSign } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: string, locality: string) => void;
  onExploreClick: () => void;
  onWorkerRegisterClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onExploreClick,
  onWorkerRegisterClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locality, setLocality] = useState('Teusaquillo / Chapinero');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm, locality);
  };

  return (
    <section className="w-full bg-white pt-10 md:pt-16 pb-12">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* Asymmetrical 2-column split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (approx 55%): Headline, subtext, search capture */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Quiet text kicker with typographic separator */}
            <div className="flex items-center gap-2 text-xs font-medium text-[#60646c]">
              <span className="text-[#ff5900] font-semibold">Échele Camello</span>
              <span aria-hidden="true">·</span>
              <span>Contratación Segura de Oficios</span>
              <span aria-hidden="true">·</span>
              <span>Colombia</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-semibold text-black tracking-[-0.03em] leading-[1.05] text-balance">
              El trabajo informal ahora se contrata con pago protegido.
            </h1>

            <p className="text-lg md:text-xl text-[#60646c] font-normal leading-relaxed max-w-xl">
              Conectamos hogares y empresas con plomeros, electricistas, personal doméstico y técnicos certificados. Tu dinero queda en <strong className="text-black font-semibold">custodia (escrow)</strong> y solo se desembolsa cuando el servicio esté 100% verificado.
            </p>

            {/* Brex Email/Search Capture Input paired with Ember Button */}
            <form onSubmit={handleSubmit} className="pt-2">
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5 p-1.5 bg-[#f3f3f7] rounded-[14px] border border-[#b9bbc6]/60 max-w-2xl">
                
                <div className="relative flex-1 flex items-center bg-white rounded-[10px] border border-[#b9bbc6]/50 px-3 py-2.5">
                  <Search className="w-4 h-4 text-[#8b8d98] shrink-0 mr-2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="¿Qué servicio necesitas? Ej: Plomero destape, Aseo..."
                    className="w-full text-sm text-black placeholder:text-[#8b8d98] bg-transparent outline-none"
                  />
                </div>

                <div className="sm:w-52 flex items-center bg-white rounded-[10px] border border-[#b9bbc6]/50 px-3 py-2.5">
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    aria-label="Zona o Barrio en Bogotá"
                    className="w-full text-xs font-medium text-black bg-transparent outline-none cursor-pointer"
                  >
                    <option value="Teusaquillo / Chapinero">Teusaquillo / Chapinero</option>
                    <option value="Usaquén / Cedritos">Usaquén / Cedritos</option>
                    <option value="Suba / Pontevedra">Suba / Pontevedra</option>
                    <option value="Kennedy / Fontibón">Kennedy / Fontibón</option>
                    <option value="Centro / Santa Fe">Centro / Candelaria</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="bg-[#ff5900] hover:bg-[#e04f00] text-white text-sm font-semibold px-6 py-3 rounded-[10px] transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Buscar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#60646c] mt-3 pl-1">
                <span>Popular hoy:</span>
                <button type="button" onClick={() => onSearch('Plomería', locality)} className="hover:text-black underline cursor-pointer">Plomería</button>
                <button type="button" onClick={() => onSearch('Aseo', locality)} className="hover:text-black underline cursor-pointer">Aseo doméstico</button>
                <button type="button" onClick={() => onSearch('Electricidad', locality)} className="hover:text-black underline cursor-pointer">Electricidad</button>
                <button type="button" onClick={() => onSearch('Pintura', locality)} className="hover:text-black underline cursor-pointer">Pintura</button>
              </div>
            </form>

            {/* Trust bullet features (clean, no slop pills) */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#f3f3f7]">
              <div>
                <div className="text-xs font-semibold text-black flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#ff5900]" />
                  <span>Escrow Transparente</span>
                </div>
                <p className="text-[11px] text-[#60646c] mt-0.5">Fondos retenidos hasta tu visto bueno final.</p>
              </div>

              <div>
                <div className="text-xs font-semibold text-black flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ff5900]" />
                  <span>Identidad Verificada</span>
                </div>
                <p className="text-[11px] text-[#60646c] mt-0.5">Cédula + selfie validados por nuestro equipo.</p>
              </div>

              <div>
                <div className="text-xs font-semibold text-black flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#ff5900]" />
                  <span>Tarifas Justas COP</span>
                </div>
                <p className="text-[11px] text-[#60646c] mt-0.5">Comisión fija de plataforma del 10% sin cobros ocultos.</p>
              </div>
            </div>

          </div>

          {/* Right Column (approx 45%): Visual Interactive Escrow Instrument */}
          <div className="lg:col-span-5">
            <div className="bg-[#f3f3f7] p-6 rounded-[16px] border border-[#b9bbc6]/40 relative">
              
              {/* Clinical Brex Financial Workbench Card */}
              <div className="bg-white rounded-[12px] p-5 border border-[#b9bbc6]/50 shadow-xs space-y-4">
                
                {/* Header state */}
                <div className="flex items-center justify-between pb-3 border-b border-[#f3f3f7]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5900]"></div>
                    <span className="text-xs font-semibold text-black tracking-tight">Radicado #EC-2026-8491</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#ff5900] bg-[#f3f3f7] px-2 py-0.5 rounded-[6px] border border-[#ff5900]/20">
                    FONDOS RETENIDOS EN ESCROW
                  </span>
                </div>

                {/* Worker lockup */}
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                    alt="Carlos Mendoza"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-[10px] object-cover border border-[#b9bbc6]/40"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-black">Carlos Enrique Mendoza</span>
                      <ShieldCheck className="w-4 h-4 text-[#ff5900]" />
                    </div>
                    <div className="text-xs text-[#60646c] flex items-center gap-1.5">
                      <span>Plomería Hidráulica</span>
                      <span>·</span>
                      <span className="text-black font-medium">★ 4.9 (87 servicios)</span>
                    </div>
                  </div>
                </div>

                {/* Scope breakdown */}
                <div className="bg-[#f3f3f7] p-3 rounded-[8px] space-y-1.5 text-xs">
                  <div className="text-[#60646c]">Alcance del servicio acordado:</div>
                  <div className="font-medium text-black">
                    Reparación de filtración en lavaplatos + cambio de empaque sifón + prueba de hermeticidad.
                  </div>
                </div>

                {/* Financial breakdown as required by RF-28 */}
                <div className="space-y-1.5 text-xs pt-1">
                  <div className="flex justify-between text-[#60646c]">
                    <span>Valor total acordado en oferta formal</span>
                    <span className="font-semibold text-black tabular-nums">$120.000 COP</span>
                  </div>
                  <div className="flex justify-between text-[#60646c]">
                    <span>Comisión de plataforma (10% fija)</span>
                    <span className="text-[#60646c] tabular-nums">-$12.000 COP</span>
                  </div>
                  <div className="flex justify-between text-black font-semibold pt-1 border-t border-[#f3f3f7]">
                    <span>Neto garantizado a liquidar al trabajador</span>
                    <span className="text-black tabular-nums font-bold text-sm">$108.000 COP</span>
                  </div>
                </div>

                {/* Status indicator bar */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[11px] text-[#60646c] mb-1.5">
                    <span>Estado del flujo</span>
                    <span className="text-black font-medium">Paso 3 de 5: Servicio en ejecución</span>
                  </div>
                  <div className="w-full bg-[#f3f3f7] h-2 rounded-full overflow-hidden border border-[#b9bbc6]/30">
                    <div className="bg-[#ff5900] h-full w-[60%]"></div>
                  </div>
                </div>

                <div className="text-[11px] text-[#60646c] flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#ff5900] shrink-0" />
                  <span>El cliente tiene hasta 72h tras terminar para confirmar o abrir disputa.</span>
                </div>

              </div>

              {/* Bottom card action */}
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-[#60646c]">¿Ofreces un oficio o servicio?</span>
                <button
                  onClick={onWorkerRegisterClick}
                  className="font-semibold text-black hover:text-[#ff5900] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Crea tu perfil laboral</span>
                  <ArrowRight className="w-3 h-3 text-[#ff5900]" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
