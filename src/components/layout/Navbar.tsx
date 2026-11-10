import React from 'react';
import { UserRole, User } from '../../types';
import { ShieldCheck, LogOut, Database, Briefcase, UserCheck, Wrench } from 'lucide-react';

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
      <div className="max-w-[1300px] mx-auto px-4 md:px-6 min-h-16 py-2 flex flex-wrap items-center justify-between gap-4">
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

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-5 text-xs md:text-sm font-medium text-black overflow-x-auto">
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

          <button
            onClick={() => setCurrentTab('contratos')}
            className={`transition-colors cursor-pointer hover:text-black py-1 whitespace-nowrap flex items-center gap-1 ${
              currentTab === 'contratos'
                ? 'text-black border-b-2 border-[#ff5900] font-semibold'
                : 'text-[#60646c]'
            }`}
          >
            <span>Solicitudes / Contratos</span>
            {contractsCount > 0 && (
              <span className="bg-[#f3f3f7] text-black text-[10px] px-1.5 py-0.2 rounded-full font-bold border border-[#b9bbc6]/50">
                {contractsCount}
              </span>
            )}
          </button>

          {currentRole === 'trabajador' && (
            <button
              onClick={() => setCurrentTab('perfil_laboral')}
              className={`transition-colors cursor-pointer hover:text-black py-1 whitespace-nowrap flex items-center gap-1 ${
                currentTab === 'perfil_laboral'
                  ? 'text-black border-b-2 border-[#ff5900] font-semibold'
                  : 'text-[#60646c]'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-[#ff5900]" />
              <span>Perfil Trabajador</span>
            </button>
          )}

          {currentRole === 'admin' && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`transition-colors cursor-pointer py-1 px-2.5 rounded-[8px] whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'admin'
                  ? 'bg-[#15191e] text-white font-bold shadow-xs'
                  : 'bg-[#fff2eb] text-[#ff5900] hover:bg-[#ffe4d4] font-semibold border border-[#ff5900]/30'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-[#ff5900]" />
              <span>Liquibase & Panel Admin</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Role Switcher (Cliente | Trabajador | Admin) + Auth Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Interactive Role Switcher for Testing (ms-usuarios RBAC Switch) */}
          <div
            className="inline-flex items-center bg-[#f3f3f7] p-1 rounded-[10px] border border-[#b9bbc6]/60 shadow-2xs"
            title="Switch rápido de Rol para pruebas (Cliente, Trabajador y Admin con acceso a Liquibase)"
          >
            <span className="text-[10px] font-mono font-bold text-[#60646c] px-2 hidden xl:inline">
              ROL:
            </span>
            <button
              type="button"
              onClick={() => setCurrentRole('cliente')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-[7px] cursor-pointer transition-all flex items-center gap-1 ${
                currentRole === 'cliente'
                  ? 'bg-white text-black shadow-xs border border-[#b9bbc6]/40 font-bold'
                  : 'text-[#60646c] hover:text-black'
              }`}
            >
              <UserCheck className="w-3 h-3 text-[#ff5900]" />
              <span>Cliente</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentRole('trabajador')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-[7px] cursor-pointer transition-all flex items-center gap-1 ${
                currentRole === 'trabajador'
                  ? 'bg-white text-black shadow-xs border border-[#b9bbc6]/40 font-bold'
                  : 'text-[#60646c] hover:text-black'
              }`}
            >
              <Briefcase className="w-3 h-3 text-[#ff5900]" />
              <span>Trabajador</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentRole('admin')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-[7px] cursor-pointer transition-all flex items-center gap-1 ${
                currentRole === 'admin'
                  ? 'bg-[#ff5900] text-white shadow-xs font-bold'
                  : 'text-[#60646c] hover:text-black'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Admin (Liquibase)</span>
            </button>
          </div>

          {!isLoggedIn ? (
            <>
              <button
                onClick={onOpenLogin}
                className="px-3.5 py-1.5 text-xs font-semibold text-black hover:bg-[#f3f3f7] border border-[#b9bbc6] rounded-[10px] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Inicio
              </button>

              <button
                onClick={onOpenRegister}
                className="bg-[#ff5900] hover:bg-[#e04f00] text-white text-xs font-semibold px-3.5 py-1.5 rounded-[10px] transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-xs"
              >
                Registrar
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2.5">
              {(() => {
                const rawNombre = (currentUser.nombre || '').replace(/\s*\([^)]*\)/g, '').trim();
                const rawApellido = (currentUser.apellido || '').replace(/\s*\([^)]*\)/g, '').trim();
                const nombreTokens = rawNombre.split(/\s+/).filter(Boolean);
                const apellidoTokens = rawApellido.split(/\s+/).filter(Boolean);
                const primerNombre = nombreTokens[0] || 'Usuario';
                const primerApellido =
                  apellidoTokens[0] || (nombreTokens.length > 1 ? nombreTokens[1] : 'Gómez');
                const primerNombreYApellido = `${primerNombre} ${primerApellido}`;

                return (
                  <button
                    onClick={() => setCurrentTab('perfil')}
                    className="flex items-center gap-2 px-2 py-1 rounded-[10px] hover:bg-[#f3f3f7] cursor-pointer transition-colors group"
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
                    <div className="text-left hidden sm:block">
                      <span className="text-[11px] font-semibold text-black leading-tight block">
                        {primerNombreYApellido}
                      </span>
                      <span className="text-[9px] font-mono uppercase text-[#ff5900] font-bold block">
                        {currentRole}
                      </span>
                    </div>
                  </button>
                );
              })()}

              <button
                onClick={onLogout}
                className="px-2.5 py-1.5 text-xs font-medium text-[#60646c] hover:text-black border border-[#b9bbc6]/60 rounded-[10px] hover:bg-[#f3f3f7] transition-colors cursor-pointer flex items-center gap-1"
                title="Cerrar sesión y volver a la Landing Page"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Salir</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
