import React, { useState } from 'react';
import { Contract } from '../../types';
import { X, ShieldCheck, Lock, CheckCircle2, ArrowRight, Smartphone, Building, CreditCard, Download, FileText } from 'lucide-react';

interface EscrowPaymentModalProps {
  contract: Contract;
  onConfirmPayment: (contractId: string, method: 'nequi' | 'pse' | 'tarjeta' | 'daviplata', reference: string) => void;
  onClose: () => void;
}

export const EscrowPaymentModal: React.FC<EscrowPaymentModalProps> = ({
  contract,
  onConfirmPayment,
  onClose
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'nequi' | 'pse' | 'tarjeta' | 'daviplata'>('nequi');
  const [phoneNumber, setPhoneNumber] = useState('3118492011');
  const [bank, setBank] = useState('Bancolombia');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');

  const handlePay = () => {
    setIsProcessing(true);
    const ref = `WMP-${paymentMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}-COL`;
    setGeneratedRef(ref);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      onConfirmPayment(contract.id, paymentMethod, ref);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-[16px] border border-[#b9bbc6] shadow-xl overflow-hidden my-8 animate-scale-in">
        
        {/* Header */}
        <div className="p-5 border-b border-[#f3f3f7] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-[#f3f3f7] flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#ff5900]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-black tracking-tight">Custodia de Pago en Escrow</h3>
              <p className="text-[11px] text-[#60646c]">Pasarela Wompi Colombia · Radicado {contract.codigoRadicado}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8b8d98] hover:text-black rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentSuccess ? (
          /* Payment Success & Receipt view (RF-30) */
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-black tracking-tight">
              ¡Pago Retenido Exitosamente en Escrow!
            </h3>

            <p className="text-xs text-[#60646c] max-w-md mx-auto leading-relaxed">
              Tus fondos están retenidos en la cuenta de custodia. El trabajador <strong className="text-black font-semibold">{contract.trabajadorNombre}</strong> ha sido notificado para iniciar el servicio.
            </p>

            {/* Receipt Summary Card */}
            <div className="bg-[#f3f3f7] p-4 rounded-[12px] border border-[#b9bbc6]/40 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#60646c]">Referencia única:</span>
                <span className="font-mono font-bold text-black">{generatedRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#60646c]">Monto retenido:</span>
                <span className="font-bold text-black tabular-nums">${contract.montoBrutoCOP.toLocaleString('es-CO')} COP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#60646c]">Método utilizado:</span>
                <span className="capitalize font-semibold text-black">{paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t border-[#b9bbc6]/30 pt-2">
                <span className="text-[#60646c]">Condición de liberación:</span>
                <span className="text-black font-medium">Aprobación del cliente o 72h</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 text-xs font-semibold text-black border border-[#b9bbc6] rounded-[10px] hover:bg-[#f3f3f7] flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#8b8d98]" />
                <span>Imprimir Comprobante (RF-30)</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#ff5900] hover:bg-[#e04f00] rounded-[10px] cursor-pointer"
              >
                Cerrar y Ver Contrato
              </button>
            </div>
          </div>
        ) : (
          /* Payment Form */
          <div className="p-6 space-y-5">
            
            {/* Service & Worker summary */}
            <div className="p-3 bg-[#f3f3f7] rounded-[10px] border border-[#b9bbc6]/40 space-y-1 text-xs">
              <div className="flex justify-between font-medium">
                <span className="text-[#60646c]">Trabajador asignado:</span>
                <span className="text-black font-bold">{contract.trabajadorNombre}</span>
              </div>
              <div className="text-[11px] text-[#60646c] line-clamp-2">
                <strong>Servicio:</strong> {contract.descripcionServicio}
              </div>
            </div>

            {/* Financial Ledger Breakdown (RF-28) */}
            <div className="space-y-2 border border-[#b9bbc6]/50 rounded-[12px] p-4 bg-white">
              <div className="text-xs font-bold text-black pb-1 border-b border-[#f3f3f7]">
                Desglose Financiero Transparente (RF-28)
              </div>
              
              <div className="flex justify-between text-xs text-[#60646c]">
                <span>Valor bruto acordado</span>
                <span className="font-semibold text-black tabular-nums">${contract.montoBrutoCOP.toLocaleString('es-CO')} COP</span>
              </div>

              <div className="flex justify-between text-xs text-[#60646c]">
                <span>Comisión de plataforma Échele Camello (10%)</span>
                <span className="tabular-nums">-${contract.comisionCOP.toLocaleString('es-CO')} COP</span>
              </div>

              <div className="flex justify-between text-xs text-black font-bold pt-2 border-t border-[#f3f3f7]">
                <span>Total a debitar hoy (Escrow)</span>
                <span className="text-base text-black tabular-nums font-black">${contract.montoBrutoCOP.toLocaleString('es-CO')} COP</span>
              </div>

              <div className="text-[11px] text-[#8b8d98] pt-1">
                Neto garantizado al trabajador tras confirmación: ${contract.montoNetoTrabajadorCOP.toLocaleString('es-CO')} COP
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-black mb-2">
                Selecciona tu medio de pago:
              </label>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('nequi')}
                  className={`p-3 rounded-[10px] border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'nequi'
                      ? 'border-[#ff5900] bg-[#fff4ed]'
                      : 'border-[#b9bbc6] bg-white hover:bg-[#f3f3f7]'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-[#ff5900]" />
                  <div>
                    <div className="font-bold text-black">Nequi</div>
                    <div className="text-[10px] text-[#60646c]">Push a tu celular</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('pse')}
                  className={`p-3 rounded-[10px] border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'pse'
                      ? 'border-[#ff5900] bg-[#fff4ed]'
                      : 'border-[#b9bbc6] bg-white hover:bg-[#f3f3f7]'
                  }`}
                >
                  <Building className="w-4 h-4 text-[#ff5900]" />
                  <div>
                    <div className="font-bold text-black">PSE</div>
                    <div className="text-[10px] text-[#60646c]">Débito bancario</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('tarjeta')}
                  className={`p-3 rounded-[10px] border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'tarjeta'
                      ? 'border-[#ff5900] bg-[#fff4ed]'
                      : 'border-[#b9bbc6] bg-white hover:bg-[#f3f3f7]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#ff5900]" />
                  <div>
                    <div className="font-bold text-black">Tarjeta</div>
                    <div className="text-[10px] text-[#60646c]">Crédito o Débito</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('daviplata')}
                  className={`p-3 rounded-[10px] border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'daviplata'
                      ? 'border-[#ff5900] bg-[#fff4ed]'
                      : 'border-[#b9bbc6] bg-white hover:bg-[#f3f3f7]'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-[#ff5900]" />
                  <div>
                    <div className="font-bold text-black">Daviplata</div>
                    <div className="text-[10px] text-[#60646c]">Billetera digital</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Dynamic input for method */}
            {paymentMethod === 'nequi' && (
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Número celular asociado a Nequi:
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-[10px] border border-[#b9bbc6] font-mono"
                  placeholder="300 000 0000"
                />
              </div>
            )}

            {paymentMethod === 'pse' && (
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Entidad bancaria:
                </label>
                <select
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  aria-label="Entidad bancaria para PSE"
                  className="w-full text-xs p-2.5 rounded-[10px] border border-[#b9bbc6] bg-white"
                >
                  <option value="Bancolombia">Bancolombia</option>
                  <option value="Davivienda">Davivienda</option>
                  <option value="Banco de Bogotá">Banco de Bogotá</option>
                  <option value="Nu Colombia">Nu Colombia</option>
                  <option value="Lulo Bank">Lulo Bank</option>
                </select>
              </div>
            )}

            {/* Escrow Guarantee Disclaimer */}
            <div className="p-3 bg-[#fff4ed] border border-[#ff5900]/30 rounded-[10px] flex items-start gap-2 text-xs text-[#15191e]">
              <ShieldCheck className="w-4 h-4 text-[#ff5900] shrink-0 mt-0.5" />
              <span className="text-[11px] leading-relaxed">
                <strong>Garantía de Retención (RF-27):</strong> Tu dinero no se transfiere al trabajador ahora. Queda en depósito protegido. Si el servicio no se ejecuta según lo acordado, tu dinero te será devuelto al 100% conforme a las reglas de cancelación.
              </span>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-3 bg-[#ff5900] hover:bg-[#e04f00] text-white rounded-[12px] text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Procesando pago con pasarela...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Confirmar Retención en Escrow (${contract.montoBrutoCOP.toLocaleString('es-CO')} COP)</span>
                </>
              )}
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
