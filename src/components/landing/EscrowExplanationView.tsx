import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, AlertTriangle, ArrowRight, FileCheck, Scale, DollarSign } from 'lucide-react';

interface EscrowExplanationViewProps {
  onStartSearch: () => void;
}

export const EscrowExplanationView: React.FC<EscrowExplanationViewProps> = ({ onStartSearch }) => {
  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 space-y-12">
        
        {/* Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-[#ff5900] mb-2 tracking-wide">
            TRANSPARENCIA FINANCIERA & SEGURIDAD (SRS SECCIÓN 4)
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold text-black tracking-[-0.03em] leading-tight">
            ¿Cómo funciona la custodia de pagos (Escrow) de Échele Camello?
          </h2>
          <p className="text-base text-[#60646c] mt-4 leading-relaxed">
            En Colombia, el 84% de las disputas en arreglos domésticos y oficios surgen por anticipos en efectivo sin garantía o cobros posteriores no pactados. Nuestro mecanismo de retención en escrow actúa como un intermediario neutral vigilado.
          </p>
        </div>

        {/* 3 Step Financial Escrow Lifecycle */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#f3f3f7] p-6 rounded-[12px] border border-[#b9bbc6]/40 space-y-3">
            <div className="w-10 h-10 rounded-[8px] bg-white flex items-center justify-center font-mono font-bold text-black border border-[#b9bbc6]/30">
              01
            </div>
            <h3 className="text-base font-bold text-black">Oferta Formal Inmutable</h3>
            <p className="text-xs text-[#60646c] leading-relaxed">
              El trabajador o cliente establece en el chat el precio exacto (COP), fecha de inicio y descripción detallada del trabajo. Al aceptarse, las condiciones no pueden modificarse unilateralmente.
            </p>
          </div>

          <div className="bg-[#f3f3f7] p-6 rounded-[12px] border border-[#ff5900]/40 space-y-3">
            <div className="w-10 h-10 rounded-[8px] bg-[#ff5900] text-white flex items-center justify-center font-mono font-bold">
              02
            </div>
            <h3 className="text-base font-bold text-black">Depósito en Custodia (Escrow)</h3>
            <p className="text-xs text-[#60646c] leading-relaxed">
              El cliente paga a través de pasarela nacional (PSE, Nequi, Daviplata o tarjeta). El dinero <strong className="text-black">queda retenido</strong> en una cuenta de custodia segura. El trabajador sabe que los fondos existen pero no los puede retirar aún.
            </p>
          </div>

          <div className="bg-[#f3f3f7] p-6 rounded-[12px] border border-[#b9bbc6]/40 space-y-3">
            <div className="w-10 h-10 rounded-[8px] bg-white flex items-center justify-center font-mono font-bold text-black border border-[#b9bbc6]/30">
              03
            </div>
            <h3 className="text-base font-bold text-black">Aprobación y Desembolso</h3>
            <p className="text-xs text-[#60646c] leading-relaxed">
              Una vez terminado el trabajo, el cliente revisa y aprueba el resultado. En ese instante se descuenta la comisión de plataforma (10%) y se liquida el neto al trabajador en máximo 3 días hábiles.
            </p>
          </div>
        </div>

        {/* Cancellation and Refund Table (§4.3) */}
        <div className="bg-white rounded-[12px] border border-[#b9bbc6]/60 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#ff5900]" />
            <h3 className="text-base font-bold text-black">
              Reglas de Cancelación y Reembolso (SRS Sección 4.3)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#b9bbc6]/40 text-[#8b8d98]">
                  <th className="py-2.5 px-3">MOMENTO DE LA CANCELACIÓN</th>
                  <th className="py-2.5 px-3">REEMBOLSO AL CLIENTE</th>
                  <th className="py-2.5 px-3">POLÍTICA APLICADA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f3f7]">
                <tr>
                  <td className="py-3 px-3 font-semibold text-black">Antes de que el trabajador inicie labores</td>
                  <td className="py-3 px-3 font-bold text-emerald-700">100% de devolución</td>
                  <td className="py-3 px-3 text-[#60646c]">Reversión automática inmediata a la pasarela original.</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-black">Cancela el trabajador en cualquier momento</td>
                  <td className="py-3 px-3 font-bold text-emerald-700">100% de devolución</td>
                  <td className="py-3 px-3 text-[#60646c]">Reembolso íntegro al cliente + penalización de reputación al trabajador.</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-black">Cancela el cliente con servicio en curso</td>
                  <td className="py-3 px-3 font-medium text-black">Según acuerdo o mediación Admin</td>
                  <td className="py-3 px-3 text-[#60646c]">Se evalúa avance físico ejecutado y materiales consumidos.</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-black">Servicio terminado sin disputa en 72 horas</td>
                  <td className="py-3 px-3 text-[#8b8d98]">Sin reembolso</td>
                  <td className="py-3 px-3 text-[#60646c]">Fondos liberados definitivamente al trabajador (RF-24).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Call to action */}
        <div className="p-8 bg-[#f3f3f7] rounded-[16px] border border-[#b9bbc6]/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-black tracking-tight">¿Tienes un arreglo o servicio pendiente en tu hogar?</h3>
            <p className="text-xs text-[#60646c] mt-1">Busca profesionales verificados en tu localidad con garantía de escrow.</p>
          </div>
          <button
            onClick={onStartSearch}
            className="px-6 py-3 bg-[#ff5900] hover:bg-[#e04f00] text-white text-xs md:text-sm font-semibold rounded-[12px] transition-colors cursor-pointer flex items-center gap-2 shrink-0 shadow-xs"
          >
            <span>Explorar Profesionales</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
