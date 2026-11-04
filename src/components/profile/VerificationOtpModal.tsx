import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, Smartphone, ArrowRight, CheckCircle2, RefreshCw, X, AlertTriangle } from 'lucide-react';

interface VerificationOtpModalProps {
  emailChanged: boolean;
  phoneChanged: boolean;
  newEmail: string;
  newPhone: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const VerificationOtpModal: React.FC<VerificationOtpModalProps> = ({
  emailChanged,
  phoneChanged,
  newEmail,
  newPhone,
  onSuccess,
  onCancel
}) => {
  // Current active step: 'email' or 'phone'
  const [currentStep, setCurrentStep] = useState<'email' | 'phone'>(emailChanged ? 'email' : 'phone');

  // Random 6-digit generated codes
  const [emailOtpCode, setEmailOtpCode] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());
  const [smsOtpCode, setSmsOtpCode] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());

  // Input states
  const [enteredCode, setEnteredCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [timer, setTimer] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailVerified, setEmailVerified] = useState(!emailChanged);
  const [phoneVerified, setPhoneVerified] = useState(!phoneChanged);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(t => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Resend handler
  const handleResend = () => {
    setTimer(45);
    setErrorMsg('');
    if (currentStep === 'email') {
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      setEmailOtpCode(newCode);
    } else {
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      setSmsOtpCode(newCode);
    }
  };

  // Submit verification
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsVerifying(false);
      const expectedCode = currentStep === 'email' ? emailOtpCode : smsOtpCode;

      if (enteredCode.trim() !== expectedCode) {
        setErrorMsg(`Código incorrecto. Ingresa los 6 dígitos recibidos.`);
        return;
      }

      if (currentStep === 'email') {
        setEmailVerified(true);
        if (phoneChanged && !phoneVerified) {
          setCurrentStep('phone');
          setEnteredCode('');
          setTimer(45);
        } else {
          onSuccess();
        }
      } else {
        setPhoneVerified(true);
        onSuccess();
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-[16px] border border-[#b9bbc6] shadow-2xl overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="p-6 border-b border-[#f3f3f7] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-orange-50 border border-[#ff5900]/30 flex items-center justify-center text-[#ff5900]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-black tracking-tight">Verificación de Seguridad</h3>
              <p className="text-xs text-[#60646c]">
                {currentStep === 'email' ? 'Confirmación de Correo Electrónico' : 'Confirmación de Línea Celular por SMS'}
              </p>
            </div>
          </div>

          <button 
            onClick={onCancel}
            className="p-1.5 rounded-[8px] text-[#8b8d98] hover:text-black hover:bg-[#f3f3f7] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator (if both changed) */}
        {emailChanged && phoneChanged && (
          <div className="flex items-center justify-between px-6 py-2.5 bg-[#f3f3f7] border-b border-[#b9bbc6]/40 text-xs font-semibold">
            <span className={`flex items-center gap-1.5 ${currentStep === 'email' ? 'text-[#ff5900]' : 'text-emerald-700'}`}>
              <Mail className="w-3.5 h-3.5" />
              <span>1. Correo {emailVerified && '✓'}</span>
            </span>
            <span className="text-[#b9bbc6]">→</span>
            <span className={`flex items-center gap-1.5 ${currentStep === 'phone' ? 'text-[#ff5900]' : 'text-[#60646c]'}`}>
              <Smartphone className="w-3.5 h-3.5" />
              <span>2. SMS Móvil</span>
            </span>
          </div>
        )}

        <div className="p-6 space-y-5">
          
          {/* Simulated Real-time Carrier / Mailbox Notification Banner */}
          {currentStep === 'email' ? (
            <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-[12px] space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-blue-900">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>Bandeja de Entrada ({newEmail})</span>
                </span>
                <span className="text-blue-600 font-mono text-[10px]">Justo ahora</span>
              </div>
              <p className="text-xs text-blue-950">
                De: <strong>seguridad@echelecamello.co</strong><br />
                Asunto: Código de validación: <span className="font-mono font-bold tracking-wider text-black bg-white px-1.5 py-0.5 rounded border border-blue-200">{emailOtpCode}</span>
              </p>
              <button
                type="button"
                onClick={() => setEnteredCode(emailOtpCode)}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer block pt-1"
              >
                Auto-completar con este código ({emailOtpCode})
              </button>
            </div>
          ) : (
            <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-[12px] space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>SMS Móvil Claro / Tigo / Movistar</span>
                </span>
                <span className="text-emerald-700 font-mono text-[10px]">+57 {newPhone}</span>
              </div>
              <p className="text-xs text-emerald-950">
                Échele Camello: Tu código de verificación SMS es <span className="font-mono font-bold tracking-wider text-black bg-white px-1.5 py-0.5 rounded border border-emerald-300">{smsOtpCode}</span>. Válido por 10 minutos. No lo compartas.
              </p>
              <button
                type="button"
                onClick={() => setEnteredCode(smsOtpCode)}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer block pt-1"
              >
                Auto-completar con este código ({smsOtpCode})
              </button>
            </div>
          )}

          {/* Form with 6-digit input */}
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-black mb-1.5 text-center">
                Ingresa el código OTP de 6 dígitos:
              </label>

              <div className="flex justify-center">
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="000000"
                  value={enteredCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setEnteredCode(val);
                    setErrorMsg('');
                  }}
                  className="w-48 text-center font-mono text-2xl font-bold tracking-widest p-2.5 rounded-[10px] border-2 border-[#b9bbc6] focus:border-[#ff5900] outline-none text-black bg-white shadow-xs"
                />
              </div>

              {errorMsg && (
                <div className="text-xs text-rose-600 font-semibold text-center mt-2 flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-[#60646c]">
              <span>¿No te llegó el código?</span>
              {timer > 0 ? (
                <span className="font-mono text-[11px] text-[#8b8d98]">Reenviar en {timer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-xs font-bold text-[#ff5900] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reenviar código</span>
                </button>
              )}
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-[#60646c] hover:text-black border border-[#b9bbc6] rounded-[10px] hover:bg-[#f3f3f7] cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={enteredCode.length < 6 || isVerifying}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-[#ff5900] hover:bg-[#e04f00] disabled:opacity-50 disabled:cursor-not-allowed rounded-[10px] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                {isVerifying ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Confirmar y Guardar</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};
