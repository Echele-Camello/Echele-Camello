import React from 'react';
import { UserRole, User } from '../../types';
import { ShieldCheck, LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: User;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLogout: () => void;
  contractsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentRole,
  setCurrentRole,
  currentUser,
  isLoggedIn,
  onOpenLogin,
  onOpenRegister,
  onLogout,
  contractsCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#b9bbc6]/40 backdrop-blur-sm">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (isLoggedIn) {
                setCurrentTab('catalogo');
              } else {
                setCurrentTab('landing');
              }
            }}
            className="text-xl font-bold tracking-tight text-black hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2"
          >
            <div className="w-6 h-6 bg-[#ff5900] rounded-sm flex items-center justify-center text-white text-xs font-black">
              EC
            </div>
            <span>Échele Camello</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links: Catálogo and Foro */}
        <nav className="flex items-center gap-6 text-sm font-medium text-black">
          {isLoggedIn && (
            <>
              <button
                onClick={() => setCurrentTab('catalogo')}
                className={`transition-colors cursor-pointer hover:text-black py-1 whitespace-nowrap ${
                  currentTab === 'catalogo' 
                    ? 'text-black border-b-2 border-[#ff5900] font-semibold' 
                    : 'text-[#60646c]'
                }`}
              >
                Catálogo
              </button>

              <button
                onClick={() => setCurrentTab('foro')}
                className={`transition-colors cursor-pointer hover:text-black py-1 whitespace-nowrap ${
                  currentTab === 'foro' 
                    ? 'text-black border-b-2 border-[#ff5900] font-semibold' 
                    : 'text-[#60646c]'
                }`}
              >
                Foro
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Exact 2 buttons requested: 'Inicio' and 'Registrar' */}
        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              {/* Button 1: 'Inicio' -> Takes to Login */}
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 text-xs md:text-sm font-semibold text-black hover:bg-[#f3f3f7] border border-[#b9bbc6] rounded-[12px] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Inicio
              </button>

              {/* Button 2: 'Registrar' -> Takes to Register */}
              <button
                onClick={onOpenRegister}
                className="bg-[#ff5900] hover:bg-[#e04f00] text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-[12px] transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-xs"
              >
                Registrar
              </button>
            </>
          ) : (
            /* Logged in as Cliente / Trabajador */
            <div className="flex items-center gap-3">
              {(() => {
                const rawNombre = (currentUser.nombre || '').replace(/\s*\([^)]*\)/g, '').trim();
                const rawApellido = (currentUser.apellido || '').replace(/\s*\([^)]*\)/g, '').trim();
                const nombreTokens = rawNombre.split(/\s+/).filter(Boolean);
                const apellidoTokens = rawApellido.split(/\s+/).filter(Boolean);
                const primerNombre = nombreTokens[0] || 'Usuario';
                const primerApellido = apellidoTokens[0] || (nombreTokens.length > 1 ? nombreTokens[1] : 'Gómez');
                const primerNombreYApellido = `${primerNombre} ${primerApellido}`;

                return (
                  <button
                    onClick={() => setCurrentTab('perfil')}
                    className="flex flex-col items-center justify-center px-2 py-0.5 rounded-[10px] hover:bg-[#f3f3f7] cursor-pointer transition-colors group"
                    title="Ir a mi Perfil y Dashboard"
                  >
                    <div className="relative">
                      <img
                        src={currentUser.avatarUrl}
                        alt={primerNombreYApellido}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover border border-[#b9bbc6] shadow-xs group-hover:border-[#ff5900] transition-colors"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white"></span>
                    </div>
                    <span className="text-[11px] font-semibold text-black leading-tight mt-0.5 whitespace-nowrap text-center">
                      {primerNombreYApellido}
                    </span>
                  </button>
                );
              })()}

              <button
                onClick={onLogout}
                className="px-3 py-1.5 text-xs font-medium text-[#60646c] hover:text-black border border-[#b9bbc6]/60 rounded-[10px] hover:bg-[#f3f3f7] transition-colors cursor-pointer flex items-center gap-1"
                title="Cerrar sesión y volver a la Landing Page"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
