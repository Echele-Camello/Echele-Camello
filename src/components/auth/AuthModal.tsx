import React, { useState } from 'react';
import { User } from '../../types';
import { X, Lock, Phone, Mail, ShieldCheck, CheckCircle2, Download, Trash2, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  onUpdateUser,
  onClose
}) => {
  const [activeMode, setActiveMode] = useState<'perfil' | 'otp_demo' | 'privacidad'>('perfil');
  
  // OTP simulation state (RF-02)
  const [phoneNumber, setPhoneNumber] = useState(currentUser.telefono);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 min
  const [otpSuccess, setOtpSuccess] = useState(false);

  // Privacy state (RF-05)
  const [hideExactLocation, setHideExactLocation] = useState(currentUser.privacidadOcultarDatos);

  const handleSendOtp = () => {
    setOtpSent(true);
    setTimerSeconds(300);
  };

  const handleOtpInput = (index: number, val: string) => {
    if (val.length > 1) val = val[0];
    const newCode = [...otpCode];
    newCode[index] = val;
    setOtpCode(newCode);

    if (newCode.every(digit => digit !== '')) {
      // Completed 6 digits!
      setTimeout(() => setOtpSuccess(true), 400);
    }
  };

  const handleSavePrivacy = () => {
    onUpdateUser({
      ...currentUser,
      privacidadOcultarDatos: hideExactLocation
    });
    alert('Preferencias de privacidad actualizadas conforme a la Ley 1581.');
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentUser, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `datos_usuario_${currentUser.id}_ley1581.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-[16px] border border-[#b9bbc6] shadow-xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-[#f3f3f7] flex items-center justify-between bg-white">
          <div>
            <h3 className="text-sm font-bold text-black tracking-tight">Cuenta & Seguridad de Datos</h3>
            <p className="text-[11px] text-[#60646c]">Cumplimiento Ley 1581 de 2012 · Hábeas Data</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8b8d98] hover:text-black rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#f3f3f7] px-6 text-xs font-medium bg-[#f3f3f7]/50 gap-4">
          <button
            onClick={() => setActiveMode('perfil')}
            className={`py-3 cursor-pointer ${activeMode === 'perfil' ? 'text-black border-b-2 border-[#ff5900] font-bold' : 'text-[#60646c]'}`}
          >
            Mi Cuenta
          </button>
          <button
            onClick={() => setActiveMode('otp_demo')}
            className={`py-3 cursor-pointer ${activeMode === 'otp_demo' ? 'text-black border-b-2 border-[#ff5900] font-bold' : 'text-[#60646c]'}`}
          >
            Validación Teléfono (OTP)
          </button>
          <button
            onClick={() => setActiveMode('privacidad')}
            className={`py-3 cursor-pointer ${activeMode === 'privacidad' ? 'text-black border-b-2 border-[#ff5900] font-bold' : 'text-[#60646c]'}`}
          >
            Privacidad (RF-05)
          </button>
        </div>

        <div className="p-6 space-y-4">
          
          {activeMode === 'perfil' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src={currentUser.avatarUrl} alt={currentUser.nombre} className="w-12 h-12 rounded-[10px] object-cover" />
                <div>
                  <h4 className="text-sm font-bold text-black">{currentUser.nombre}</h4>
                  <div className="text-xs text-[#60646c]">{currentUser.correo}</div>
                  <div className="text-[11px] text-[#8b8d98]">{currentUser.barrio}</div>
                </div>
              </div>

              <div className="p-3 bg-[#f3f3f7] rounded-[10px] space-y-1 text-xs">
                <div><strong>Rol activo:</strong> {currentUser.currentRole.toUpperCase()}</div>
                <div><strong>Fecha de registro:</strong> {currentUser.fechaRegistro}</div>
                <div><strong>Consentimiento Ley 1581:</strong> Aceptado (Versión 2.0)</div>
              </div>

              <div className="pt-2 border-t border-[#f3f3f7] flex items-center justify-between">
                <button
                  onClick={handleExportData}
                  className="px-3 py-1.5 text-xs font-medium text-black border border-[#b9bbc6] rounded-[8px] hover:bg-[#f3f3f7] flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar mis datos (RF-06)</span>
                </button>
                <button
                  onClick={() => alert('Solicitud de revocación y eliminación de cuenta radicada conforme a la Ley 1581 (plazo 15 días hábiles).')}
                  className="px-3 py-1.5 text-xs font-medium text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar cuenta</span>
                </button>
              </div>
            </div>
          )}

          {activeMode === 'otp_demo' && (
            <div className="space-y-4">
              <div className="text-xs text-[#60646c]">
                <strong>Prueba del flujo de autenticación OTP (RF-02):</strong> Simula el envío de código de un solo uso por SMS con vigencia de 5 minutos y máximo 5 intentos.
              </div>

              {!otpSent ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-black mb-1">Número celular colombiano:</label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-black bg-[#f3f3f7] px-2.5 py-2 rounded-[8px] border border-[#b9bbc6]">
                        +57
                      </span>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full text-xs p-2 rounded-[8px] border border-[#b9bbc6] font-mono text-black"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSendOtp}
                    className="w-full py-2.5 text-xs font-semibold text-white bg-[#ff5900] hover:bg-[#e04f00] rounded-[10px] cursor-pointer"
                  >
                    Enviar Código OTP por SMS
                  </button>
                </div>
              ) : otpSuccess ? (
                <div className="p-4 bg-emerald-50 rounded-[10px] text-center space-y-2 border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <div className="text-sm font-bold text-emerald-900">¡Teléfono Verificado con Éxito!</div>
                  <div className="text-xs text-emerald-700">Tu cuenta ahora cuenta con doble factor de seguridad para retiros de pagos.</div>
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="text-xs text-[#60646c]">
                    Ingresa el código de 6 dígitos enviado a <strong>{phoneNumber}</strong>:
                    <br />
                    <span className="text-[11px] text-[#ff5900]">(Ingresa cualquier número de 6 dígitos para probar)</span>
                  </div>

                  <div className="flex justify-center gap-2">
                    {otpCode.map((digit, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpInput(i, e.target.value)}
                        className="w-9 h-11 text-center font-bold text-base border border-[#b9bbc6] rounded-[8px] bg-white focus:border-[#ff5900] outline-none"
                      />
                    ))}
                  </div>

                  <div className="text-[11px] text-[#8b8d98]">
                    Expira en: 04:52 min · Intentos restantes: 4/5
                  </div>
                </div>
              )}
            </div>
          )}

          {activeMode === 'privacidad' && (
            <div className="space-y-4">
              <div className="text-xs text-[#60646c] leading-relaxed">
                <strong>Garantía de Privacidad en API Pública (RF-05):</strong> La dirección exacta nunca se expone a terceros en la web ni en listados públicos; solo el barrio o radio aproximado.
              </div>

              <div className="p-4 rounded-[12px] bg-[#f3f3f7] border border-[#b9bbc6]/40 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hideExactLocation}
                    onChange={(e) => setHideExactLocation(e.target.checked)}
                    className="mt-0.5 accent-[#ff5900] rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-black block">
                      Ocultar teléfono y dirección exacta a clientes antes de pago
                    </span>
                    <span className="text-[11px] text-[#60646c]">
                      Solo se revelará tu dirección cuando el contrato esté en estado "Pagado en Escrow".
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSavePrivacy}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#ff5900] hover:bg-[#e04f00] rounded-[10px] cursor-pointer"
                >
                  Guardar Preferencias
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
