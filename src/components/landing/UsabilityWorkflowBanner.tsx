import React from 'react';
import { Search, MessageSquare, FileCheck2, CreditCard, CheckCircle, Star } from 'lucide-react';

interface UsabilityWorkflowBannerProps {
  onStartWorkflow?: () => void;
}

export const UsabilityWorkflowBanner: React.FC<UsabilityWorkflowBannerProps> = ({ onStartWorkflow }) => {
  const steps = [
    {
      step: '01',
      title: 'Búsqueda por cercanía',
      desc: 'Encuentra especialistas con tarifas claras en tu barrio o localidad.',
      icon: Search
    },
    {
      step: '02',
      title: 'Chat en tiempo real',
      desc: 'Explica tu necesidad y recibe respuestas rápidas sin intermediarios telefónicos.',
      icon: MessageSquare
    },
    {
      step: '03',
      title: 'Oferta formal inmutable',
      desc: 'El trabajador envía una propuesta con precio, fecha, hora y alcance cerrado.',
      icon: FileCheck2
    },
    {
      step: '04',
      title: 'Pago seguro en Escrow',
      desc: 'Pagas por PSE, Nequi o tarjeta. El dinero queda retenido y blindado.',
      icon: CreditCard
    },
    {
      step: '05',
      title: 'Confirmación del servicio',
      desc: 'Verificas el trabajo en casa. Solo con tu aprobación se desembolsan los fondos.',
      icon: CheckCircle
    },
    {
      step: '06',
      title: 'Calificación bidireccional',
      desc: 'Construye reputación transparente para que el sector informal prospere.',
      icon: Star
    }
  ];

  return (
    <section className="w-full bg-[#f3f3f7] py-16 border-y border-[#b9bbc6]/40">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold text-[#ff5900] mb-2 tracking-wide">
            ESTÁNDAR DE USABILIDAD (RNF-08)
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-black tracking-[-0.02em]">
            Contrata en 6 pasos y menos de 5 minutos
          </h2>
          <p className="text-sm text-[#60646c] mt-2 leading-relaxed">
            Eliminamos la desconfianza del anticipo en efectivo y la informalidad desprotegida mediante un protocolo transparente.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-white p-6 rounded-[12px] border border-[#b9bbc6]/40 relative group hover:border-[#ff5900]/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-[8px] bg-[#f3f3f7] flex items-center justify-center text-black">
                    <Icon className="w-5 h-5 text-black group-hover:text-[#ff5900] transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-[#8b8d98] font-mono">
                    PASO {item.step}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-black mb-1.5 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-[#60646c] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Customer Logo Trust Band - Brex monochrome style */}
        <div className="mt-16 pt-10 border-t border-[#b9bbc6]/30 text-center">
          <p className="text-xs font-medium text-[#8b8d98] mb-6">
            MÉTODOS DE PAGO COLOMBIANOS Y CUMPLIMIENTO REGULATORIO
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center justify-center opacity-80">
            <div className="h-10 flex items-center justify-center border border-[#b9bbc6]/30 rounded-[8px] bg-white text-xs font-bold text-[#60646c] tracking-wider">
              WOMPI
            </div>
            <div className="h-10 flex items-center justify-center border border-[#b9bbc6]/30 rounded-[8px] bg-white text-xs font-bold text-[#60646c] tracking-wider">
              PSE COLOMBIA
            </div>
            <div className="h-10 flex items-center justify-center border border-[#b9bbc6]/30 rounded-[8px] bg-white text-xs font-bold text-[#60646c] tracking-wider">
              NEQUI
            </div>
            <div className="h-10 flex items-center justify-center border border-[#b9bbc6]/30 rounded-[8px] bg-white text-xs font-bold text-[#60646c] tracking-wider">
              DAVIPLATA
            </div>
            <div className="h-10 flex items-center justify-center border border-[#b9bbc6]/30 rounded-[8px] bg-white text-xs font-bold text-[#60646c] tracking-wider">
              BANCOLOMBIA
            </div>
            <div className="h-10 flex items-center justify-center border border-[#b9bbc6]/30 rounded-[8px] bg-white text-xs font-bold text-[#60646c] tracking-wider">
              LEY 1581/2012
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
