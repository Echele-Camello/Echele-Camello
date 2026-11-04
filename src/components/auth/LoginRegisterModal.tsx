import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { User } from '../../types';

interface LoginRegisterModalProps {
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccessLogin: (user: Partial<User>, provider?: string) => void;
}

export const LoginRegisterModal: React.FC<LoginRegisterModalProps> = ({
  initialMode,
  onClose,
  onSuccessLogin
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('alejandro.gomez@bogota.co');
  const [password, setPassword] = useState('password123');
  const [nombre, setNombre] = useState('Alejandro Gómez Restrepo');
  const [telefono, setTelefono] = useState('+57 311 849 2011');
  const [habeasDataAccepted, setHabeasDataAccepted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSocialLogin = (provider: 'google' | 'facebook') => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccessLogin({
        id: 'cliente1',
        nombre: 'Alejandro Gómez',
        apellido: 'Gómez',
        correo: provider === 'google' ? 'alejandro.gomez@gmail.com' : 'alejandro.fb@facebook.com',
        currentRole: 'cliente',
        roles: ['cliente']
      }, provider);
      onClose();
    }, 600);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habeasDataAccepted) {
      alert('Debes aceptar los términos y la política de tratamiento de datos personales (Ley 1581 de 2012).');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccessLogin({
        id: 'cliente1',
        nombre: mode === 'register' ? nombre : 'Alejandro Gómez Restrepo',
        correo: email,
        telefono,
        currentRole: 'cliente',
        roles: ['cliente']
      }, 'email');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-[16px] border border-[#b9bbc6] shadow-2xl overflow-hidden my-8 animate-scale-in">
        
        {/* Header */}
        <div className="p-5 border-b border-[#f3f3f7] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#ff5900] rounded-sm flex items-center justify-center text-white text-xs font-black">
              EC
            </div>
            <div>
              <h3 className="text-sm font-bold text-black tracking-tight">
                {mode === 'login' ? 'Iniciar Sesión en Échele Camello' : 'Crear Cuenta de Cliente'}
              </h3>
              <p className="text-[11px] text-[#60646c]">Acceso seguro con rol de Cliente</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8b8d98] hover:text-black rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch between Login and Register */}
        <div className="grid grid-cols-2 p-1.5 bg-[#f3f3f7] border-b border-[#b9bbc6]/40 text-xs font-semibold">
          <button
            onClick={() => setMode('login')}
            className={`py-2 rounded-[8px] transition-colors cursor-pointer ${
              mode === 'login' ? 'bg-white text-black shadow-xs font-bold' : 'text-[#60646c] hover:text-black'
            }`}
          >
            Inicio de Sesión
          </button>
          <button
            onClick={() => setMode('register')}
            className={`py-2 rounded-[8px] transition-colors cursor-pointer ${
              mode === 'register' ? 'bg-white text-black shadow-xs font-bold' : 'text-[#60646c] hover:text-black'
            }`}
          >
            Registrarme como Cliente
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          {/* Social Logins: Google & Facebook */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-white hover:bg-[#f3f3f7] text-black border border-[#b9bbc6] rounded-[10px] text-xs font-semibold flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              {/* Google G SVG */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuar con Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-[10px] text-xs font-semibold flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              {/* Facebook F SVG */}
              <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Continuar con Facebook</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px bg-[#b9bbc6]/40 flex-1"></div>
            <span className="text-[10px] text-[#8b8d98] font-semibold uppercase tracking-wider">o con correo</span>
            <div className="h-px bg-[#b9bbc6]/40 flex-1"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitForm} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-black mb-1">Nombre completo:</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-[8px] border border-[#b9bbc6] focus:border-[#ff5900] outline-none text-black"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-black mb-1">Correo electrónico:</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-2.5 rounded-[8px] border border-[#b9bbc6] focus:border-[#ff5900] outline-none text-black"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-black mb-1">Teléfono celular (Colombia):</label>
                <input
                  type="tel"
                  required
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+57 311 000 0000"
                  className="w-full text-xs p-2.5 rounded-[8px] border border-[#b9bbc6] focus:border-[#ff5900] outline-none text-black font-mono"
                />
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-black">Contraseña:</label>
                {mode === 'login' && (
                  <button type="button" onClick={() => alert('Enlace de recuperación enviado al correo registrado (vigencia 30 min, RF-04).')} className="text-[10px] text-[#ff5900] hover:underline">
                    ¿Olvidaste tu clave?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs p-2.5 rounded-[8px] border border-[#b9bbc6] focus:border-[#ff5900] outline-none text-black"
              />
            </div>

            {/* Legal Consent Checkbox (RF-07) */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-[#60646c]">
                <input
                  type="checkbox"
                  checked={habeasDataAccepted}
                  onChange={(e) => setHabeasDataAccepted(e.target.checked)}
                  className="mt-0.5 accent-[#ff5900] rounded shrink-0"
                />
                <span className="text-[11px] leading-tight">
                  Acepto los Términos del Servicio y autorizo el tratamiento de mis datos personales conforme a la <strong>Ley 1581 de 2012</strong> y Decreto 1377.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#ff5900] hover:bg-[#e04f00] text-white rounded-[10px] text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Iniciando sesión como Cliente...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Iniciar Sesión e Ingresar a Clientes' : 'Completar Registro e Ingresar'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
