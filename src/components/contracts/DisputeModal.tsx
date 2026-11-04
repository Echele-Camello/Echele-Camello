import React, { useState } from 'react';
import { Contract, Dispute } from '../../types';
import { X, AlertTriangle, ShieldAlert, Upload, CheckCircle2, FileText } from 'lucide-react';

interface DisputeModalProps {
  contract: Contract;
  onSubmitDispute: (disputeData: Partial<Dispute>) => void;
  onClose: () => void;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({
  contract,
  onSubmitDispute,
  onClose
}) => {
  const [motivo, setMotivo] = useState('Incumplimiento de especificaciones acordadas');
  const [descripcion, setDescripcion] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion.trim()) return;

    onSubmitDispute({
      contratoId: contract.id,
      iniciadaPorId: contract.clienteId,
      iniciadaPorNombre: contract.clienteNombre,
      iniciadaPorRol: 'cliente',
      motivo,
      descripcion: descripcion.trim(),
      evidencias: evidenceUrl ? [evidenceUrl] : [],
      estado: 'abierta',
      fechaApertura: new Date().toLocaleString()
    });

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-[16px] border border-[#b9bbc6] shadow-xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-[#f3f3f7] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-rose-50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-black tracking-tight">Apertura de Disputa Formal (RF-37)</h3>
              <p className="text-[11px] text-[#60646c]">Radicado {contract.codigoRadicado}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8b8d98] hover:text-black rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-200">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h4 className="text-base font-bold text-black">
              Disputa Radicada · Fondos Congelados en Escrow
            </h4>

            <p className="text-xs text-[#60646c] leading-relaxed">
              La liberación del pago (${contract.montoBrutoCOP.toLocaleString('es-CO')} COP) ha sido retenida preventivamente. Nuestro equipo de auditoría revisará la evidencia y emitirá un dictamen en un plazo máximo de 5 días hábiles conforme al SRS RF-38.
            </p>

            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-white bg-black rounded-[10px] cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Escrow Freeze Warning */}
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-[10px] flex items-start gap-2 text-xs text-rose-900">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="text-[11px] leading-tight">
                <strong>Congelación inmediata de fondos:</strong> Al abrir esta reclamación, se bloquea el desembolso automático y pasa a mediación de auditoría.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">
                Motivo del reclamo:
              </label>
              <select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                aria-label="Motivo del reclamo"
                className="w-full text-xs p-2.5 rounded-[10px] border border-[#b9bbc6] bg-white text-black"
              >
                <option value="Incumplimiento de especificaciones acordadas">Incumplimiento de especificaciones acordadas</option>
                <option value="Trabajo inconcluso o abandonado">Trabajo inconcluso o abandonado</option>
                <option value="Daños a instalaciones o bienes">Daños a instalaciones o bienes</option>
                <option value="No comparecencia del profesional">No comparecencia del profesional</option>
                <option value="Cobro no autorizado adicional">Cobro no autorizado adicional</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">
                Descripción de los hechos y pretensión:
              </label>
              <textarea
                required
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Detalla lo sucedido con fechas, observaciones y qué solución consideras justa (reparación o reembolso)..."
                className="w-full text-xs p-3 rounded-[10px] border border-[#b9bbc6] focus:border-rose-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">
                Evidencia fotográfica (URL de imagen o foto adjunta):
              </label>
              <input
                type="text"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs p-2.5 rounded-[10px] border border-[#b9bbc6] text-black"
              />
              <span className="text-[10px] text-[#8b8d98] mt-1 block">
                Soporta imágenes de fallas, daños o chats para la revisión de soporte.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#f3f3f7]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-black border border-[#b9bbc6] rounded-[10px] hover:bg-[#f3f3f7] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-[10px] cursor-pointer"
              >
                Radicar Disputa y Congelar Fondos
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
