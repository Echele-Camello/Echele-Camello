import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, CheckCircle2, ArrowRight, Building2, 
  Scale, Users, HeartHandshake, FileText, BadgeCheck, DollarSign, Award
} from 'lucide-react';

interface CompanyLandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenWorkerOnboarding: () => void;
}

export const CompanyLandingPage: React.FC<CompanyLandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
  onOpenWorkerOnboarding
}) => {
  const [dynamicAmount, setDynamicAmount] = useState(120000);

  return (
    <div className="w-full bg-white">
      
      {/* Hero Section: Corporate identity & purpose */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 pt-12 md:pt-20 pb-16">
        <div className="max-w-3xl space-y-6">
          
          <div className="flex items-center gap-2 text-xs font-semibold text-[#60646c]">
            <span className="text-[#ff5900] font-bold">Échele Camello S.A.S.</span>
            <span aria-hidden="true">·</span>
            <span>Institucional & Corporativo</span>
            <span aria-hidden="true">·</span>
            <span>Colombia</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-semibold text-black tracking-[-0.03em] leading-[1.05] text-balance">
            La plataforma que brinda seguridad, confianza y custodia de pagos al trabajo informal.
          </h1>

          <p className="text-lg md:text-xl text-[#60646c] font-normal leading-relaxed">
            Échele Camello es una empresa de tecnología social e intermediación financiera diseñada para resolver el problema histórico de la desconfianza y la falta de garantías en los oficios no regulados en Colombia.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenRegister}
              className="px-6 py-3 bg-[#ff5900] hover:bg-[#e04f00] text-white text-sm font-semibold rounded-[12px] transition-colors cursor-pointer shadow-xs flex items-center gap-2"
            >
              <span>Registrarme como Cliente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenLogin}
              className="px-6 py-3 bg-white hover:bg-[#f3f3f7] text-black border border-[#b9bbc6] text-sm font-semibold rounded-[12px] transition-colors cursor-pointer"
            >
              Iniciar Sesión
            </button>
          </div>

        </div>
      </section>

      {/* Corporate Mission, Vision & Impact */}
      <section className="w-full bg-[#f3f3f7] py-16 border-y border-[#b9bbc6]/40">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-[12px] border border-[#b9bbc6]/40 space-y-3">
              <div className="w-10 h-10 rounded-[8px] bg-[#f3f3f7] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#ff5900]" />
              </div>
              <h3 className="text-base font-bold text-black tracking-tight">Nuestra Misión</h3>
              <p className="text-xs text-[#60646c] leading-relaxed">
                Empoderar y dignificar a los trabajadores independientes y del sector informal en Colombia, proveyendo un entorno digital seguro donde hogares y empresas contraten con total respaldo financiero y legal.
              </p>
            </div>

            <div className="bg-white p-7 rounded-[12px] border border-[#b9bbc6]/40 space-y-3">
              <div className="w-10 h-10 rounded-[8px] bg-[#f3f3f7] flex items-center justify-center">
                <Scale className="w-5 h-5 text-[#ff5900]" />
              </div>
              <h3 className="text-base font-bold text-black tracking-tight">Nuestra Visión</h3>
              <p className="text-xs text-[#60646c] leading-relaxed">
                Consolidarnos como el estándar de confianza e intermediación segura en América Latina para más de 12 millones de trabajadores de oficios, erradicando los fraudes en anticipos de dinero.
              </p>
            </div>

            <div className="bg-white p-7 rounded-[12px] border border-[#b9bbc6]/40 space-y-3">
              <div className="w-10 h-10 rounded-[8px] bg-[#f3f3f7] flex items-center justify-center">
                <HeartHandshake className="w-5 h-5 text-[#ff5900]" />
              </div>
              <h3 className="text-base font-bold text-black tracking-tight">Impacto Social Positivo</h3>
              <p className="text-xs text-[#60646c] leading-relaxed">
                Democratizamos el acceso al trabajo digno sin cargas laborales leoninas ni trámites burocráticos. La reputación y las reseñas verificadas se convierten en el capital de cada camellador.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* The 4 Core Pillars of Échele Camello */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-20 space-y-12">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold text-[#ff5900] mb-2 tracking-wide">
            LOS 4 PILARES ESTRATÉGICOS DE LA EMPRESA
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-black tracking-tight">
            ¿Por qué Échele Camello transforma el mercado informal?
          </h2>
          <p className="text-sm text-[#60646c] mt-2">
            Construimos tecnología orientada al usuario bajo estándares IEEE 830 y normativas de comercio electrónico en Colombia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-[12px] border border-[#b9bbc6]/50 space-y-3">
            <div className="w-9 h-9 rounded-[8px] bg-[#f3f3f7] flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#ff5900]" />
            </div>
            <h4 className="text-sm font-bold text-black">1. Custodia Escrow Neutral</h4>
            <p className="text-xs text-[#60646c] leading-relaxed">
              El cliente consigna a través de pasarela autorizada (Wompi, Nequi, PSE). El dinero queda retenido y únicamente se transfiere cuando el cliente aprueba el trabajo.
            </p>
          </div>

          <div className="p-6 bg-white rounded-[12px] border border-[#b9bbc6]/50 space-y-3">
            <div className="w-9 h-9 rounded-[8px] bg-[#f3f3f7] flex items-center justify-center">
              <BadgeCheck className="w-4 h-4 text-[#ff5900]" />
            </div>
            <h4 className="text-sm font-bold text-black">2. Verificación de Identidad</h4>
            <p className="text-xs text-[#60646c] leading-relaxed">
              Cada prestador de servicios presenta su Cédula de Ciudadanía colombiana y fotografía biométrica selfie que es revisada manualmente por nuestro equipo antes de otorgar la insignia.
            </p>
          </div>

          <div className="p-6 bg-white rounded-[12px] border border-[#b9bbc6]/50 space-y-3">
            <div className="w-9 h-9 rounded-[8px] bg-[#f3f3f7] flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#ff5900]" />
            </div>
            <h4 className="text-sm font-bold text-black">3. Ofertas Formales Inmutables</h4>
            <p className="text-xs text-[#60646c] leading-relaxed">
              Toda contratación nace de una propuesta formal dentro del chat: precio cerrado en COP, fecha pactada y alcance de obra sin variaciones sorpresivas.
            </p>
          </div>

          <div className="p-6 bg-white rounded-[12px] border border-[#b9bbc6]/50 space-y-3">
            <div className="w-9 h-9 rounded-[8px] bg-[#f3f3f7] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#ff5900]" />
            </div>
            <h4 className="text-sm font-bold text-black">4. Privacidad (Ley 1581)</h4>
            <p className="text-xs text-[#60646c] leading-relaxed">
              Cumplimiento estricto del régimen de Hábeas Data en Colombia. La dirección exacta y número telefónico nunca se publican abiertamente en la web.
            </p>
          </div>
        </div>
      </section>

      {/* Transparent Financial Model with Dynamic Escrow Simulator (SRS S-02, RF-28) */}
      <section className="w-full bg-[#f3f3f7] py-16 border-y border-[#b9bbc6]/40">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="bg-white p-8 md:p-10 rounded-[16px] border border-[#b9bbc6]/60 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-semibold text-[#ff5900] tracking-wide">
                MODELO FINANCIERO DINÁMICO & ESCROW (SRS S-02, RF-28)
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold text-black tracking-tight">
                Tarifas 100% transparentes: Comisión fija del 10%
              </h3>
              <p className="text-xs md:text-sm text-[#60646c] leading-relaxed">
                En Échele Camello no cobramos mensualidades fijas a los trabajadores ni membresías de suscripción a los clientes. El registro y la navegación son totalmente gratuitos. Solo cobramos una comisión del 10% sobre los contratos exitosamente completados y pagados con escrow.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-3 bg-[#f3f3f7] rounded-[8px] transition-smooth hover:border-[#ff5900]/40 border border-transparent">
                  <span className="font-bold text-black block mb-0.5">Para Clientes:</span>
                  <span className="text-[#60646c]">Pagas el monto pactado sin recargos sorpresa ni tarifas ocultas.</span>
                </div>
                <div className="p-3 bg-[#f3f3f7] rounded-[8px] transition-smooth hover:border-[#ff5900]/40 border border-transparent">
                  <span className="font-bold text-black block mb-0.5">Para Trabajadores:</span>
                  <span className="text-[#60646c]">Recibes el 90% neto directamente en tu Nequi o cuenta en ≤ 3 días.</span>
                </div>
              </div>
            </div>

            {/* Dynamic Interactive Simulator */}
            <div className="lg:col-span-5 bg-[#f3f3f7] p-6 rounded-[12px] border border-[#b9bbc6]/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-black">Simulador Dinámico de Liquidación</span>
                <span className="text-[10px] font-semibold text-[#ff5900] bg-white px-2 py-0.5 rounded-[4px] border border-[#ff5900]/30">
                  EN VIVO
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-[#60646c]">Monto del servicio a contratar:</span>
                  <span className="font-bold text-black text-sm tabular-nums">
                    ${dynamicAmount.toLocaleString('es-CO')} COP
                  </span>
                </div>
                <input
                  type="range"
                  min="30000"
                  max="1000000"
                  step="10000"
                  value={dynamicAmount}
                  onChange={(e) => setDynamicAmount(Number(e.target.value))}
                  className="w-full accent-[#ff5900] cursor-pointer h-2 bg-white rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-[#8b8d98] mt-1">
                  <span>$30.000 COP</span>
                  <span>$500.000 COP</span>
                  <span>$1.000.000 COP</span>
                </div>
              </div>

              {/* Real-time Dynamic Breakdown */}
              <div className="space-y-2 text-xs bg-white p-3.5 rounded-[10px] border border-[#b9bbc6]/40">
                <div className="flex justify-between text-[#60646c]">
                  <span>Valor retenido en Escrow:</span>
                  <span className="font-semibold text-black tabular-nums transition-smooth">
                    ${dynamicAmount.toLocaleString('es-CO')} COP
                  </span>
                </div>
                <div className="flex justify-between text-[#60646c]">
                  <span>Comisión plataforma Échele Camello (10%):</span>
                  <span className="tabular-nums text-[#ff5900] font-semibold transition-smooth">
                    -${Math.round(dynamicAmount * 0.1).toLocaleString('es-CO')} COP
                  </span>
                </div>
                <div className="flex justify-between text-black font-bold pt-2 border-t border-[#f3f3f7]">
                  <span>Neto transferido al trabajador:</span>
                  <span className="text-emerald-700 font-extrabold text-base tabular-nums transition-smooth">
                    ${Math.round(dynamicAmount * 0.9).toLocaleString('es-CO')} COP
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-[#8b8d98] flex items-center justify-between">
                <span>Plazo de liquidación: ≤ 3 días hábiles</span>
                <span className="text-black font-medium">Auto-confirmación: 72 horas</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Band */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-20 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-xs font-semibold text-[#ff5900]">COBERTURA DE OFICIOS</div>
          <h3 className="text-2xl md:text-3xl font-semibold text-black">
            Oficios y Trabajos Formalizados en la Plataforma
          </h3>
          <p className="text-xs text-[#60646c]">
            Gestionados dinámicamente desde base de datos conforme al SRS v2.0.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          <div className="p-4 bg-white rounded-[12px] border border-[#b9bbc6]/40 hover:border-[#ff5900] transition-colors">
            <div className="text-sm font-bold text-black mb-1">Plomería & Gas</div>
            <div className="text-[11px] text-[#60646c]">Fugas, griferías, calentadores</div>
          </div>
          <div className="p-4 bg-white rounded-[12px] border border-[#b9bbc6]/40 hover:border-[#ff5900] transition-colors">
            <div className="text-sm font-bold text-black mb-1">Aseo Doméstico</div>
            <div className="text-[11px] text-[#60646c]">Limpieza profunda y cocina</div>
          </div>
          <div className="p-4 bg-white rounded-[12px] border border-[#b9bbc6]/40 hover:border-[#ff5900] transition-colors">
            <div className="text-sm font-bold text-black mb-1">Electricidad</div>
            <div className="text-[11px] text-[#60646c]">Breakers, luces y cableado</div>
          </div>
          <div className="p-4 bg-white rounded-[12px] border border-[#b9bbc6]/40 hover:border-[#ff5900] transition-colors">
            <div className="text-sm font-bold text-black mb-1">Pintura & Estuco</div>
            <div className="text-[11px] text-[#60646c]">Drywall, fachadas e interiores</div>
          </div>
          <div className="p-4 bg-white rounded-[12px] border border-[#b9bbc6]/40 hover:border-[#ff5900] transition-colors">
            <div className="text-sm font-bold text-black mb-1">Acarreos Urbanos</div>
            <div className="text-[11px] text-[#60646c]">Mudanzas y transporte</div>
          </div>
          <div className="p-4 bg-white rounded-[12px] border border-[#b9bbc6]/40 hover:border-[#ff5900] transition-colors">
            <div className="text-sm font-bold text-black mb-1">Varios & Mascotas</div>
            <div className="text-[11px] text-[#60646c]">Jardinería, paseo canino</div>
          </div>
        </div>
      </section>

      {/* Legal & Regulatory Compliance Band */}
      <section className="w-full bg-[#15191e] text-white py-14">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#ff5900]">
              <ShieldCheck className="w-4 h-4" />
              <span>MARCO LEGAL Y PROTECCIÓN AL CONSUMIDOR</span>
            </div>
            <h4 className="text-xl font-bold tracking-tight text-white">
              Cumplimiento irrestricto de la Ley 1581 de 2012 (Hábeas Data)
            </h4>
            <p className="text-xs text-[#8b8d98] leading-relaxed">
              Échele Camello opera como una plataforma de intermediación tecnológica y de servicios de pago. La plataforma no almacena datos de tarjetas de crédito directamente y garantiza los derechos de acceso, rectificación y supresión de datos personales.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenRegister}
              className="px-5 py-2.5 bg-[#ff5900] hover:bg-[#e04f00] text-white rounded-[10px] text-xs font-semibold cursor-pointer shadow-xs"
            >
              Registrarme como Cliente
            </button>
            <button
              onClick={onOpenLogin}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-[10px] text-xs font-semibold cursor-pointer"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
