import React, { useState, useEffect, useRef } from 'react';
import { WorkerProfile, User, ChatMessage, FormalOffer } from '../../types';
import { 
  X, Send, ShieldAlert, FileText, CheckCircle2, Clock, 
  AlertTriangle, DollarSign, ArrowRight, ShieldCheck, Flag, Check
} from 'lucide-react';

interface ChatModalProps {
  worker: WorkerProfile;
  currentUser: User;
  messages: ChatMessage[];
  onSendMessage: (text: string, oferta?: FormalOffer) => void;
  onAcceptOffer: (offer: FormalOffer) => void;
  onRejectOffer: (offerId: string) => void;
  onCounterOffer: (offer: FormalOffer, newPriceCOP: number, newNotes: string) => void;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  worker,
  currentUser,
  messages,
  onSendMessage,
  onAcceptOffer,
  onRejectOffer,
  onCounterOffer,
  onClose
}) => {
  const [inputText, setInputText] = useState('');
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [antiLeakWarning, setAntiLeakWarning] = useState<string | null>(null);
  
  // Formal offer form state
  const [offerDesc, setOfferDesc] = useState('');
  const [offerPrice, setOfferPrice] = useState<number>(worker.tarifaPorHora * 2);
  const [offerDateTime, setOfferDateTime] = useState('Mañana, 9:00 AM');
  const [offerValidityHours, setOfferValidityHours] = useState(24);

  // Counter offer state
  const [counterOfferId, setCounterOfferId] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState<number>(0);
  const [counterNotes, setCounterNotes] = useState('');
  const [isWorkerTyping, setIsWorkerTyping] = useState(false);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showOfferForm, isWorkerTyping]);

  // Anti-leak detection (RF-22)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);

    // Colombian phone regex: 3XX XXX XXXX or 10 digits starting with 3
    const phonePattern = /(?:3[0-9]{9}|3[0-9]{2}[\s\-\.][0-9]{3}[\s\-\.][0-9]{4}|3[0-9]{2}\s?[0-9]{7})/;
    const linkPattern = /(?:wa\.me|whatsapp|bit\.ly|t\.me|transferencia|efectivo|consignacion|por\sfuera)/i;

    if (phonePattern.test(val) || linkPattern.test(val)) {
      setAntiLeakWarning(
        'Aviso de seguridad (RF-22): Detectamos datos de contacto externo. Recuerda que los pagos fuera de la plataforma pierden la custodia Escrow y la garantía de reembolso.'
      );
    } else {
      setAntiLeakWarning(null);
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    onSendMessage(userText);
    setInputText('');
    setAntiLeakWarning(null);

    // Simulated dynamic typing and reply from worker (SRS RF-13, RF-17)
    setTimeout(() => {
      setIsWorkerTyping(true);
    }, 600);

    setTimeout(() => {
      setIsWorkerTyping(false);
      const responses = [
        `¡Entendido! Cuento con los repuestos y herramienta adecuada para ese arreglo. Si le parece, revise la oferta formal o acordamos la hora.`,
        `Perfecto. Puedo desplazarme a su dirección en el horario acordado con toda la garantía del escrow.`,
        `De acuerdo. Déjeme chequear el tráfico y los materiales, ya le confirmo en la oferta.`
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      onSendMessage(randomReply);
    }, 2200);
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerDesc.trim() || offerPrice <= 0) return;

    const newOffer: FormalOffer = {
      id: `off-${Date.now()}`,
      conversacionId: `conv-${worker.id}`,
      emisorId: currentUser.id,
      receptorId: worker.id,
      descripcionServicio: offerDesc.trim(),
      precioCOP: offerPrice,
      fechaHoraPactada: offerDateTime,
      vigenciaHoras: offerValidityHours,
      version: 1,
      estado: 'pendiente',
      fechaEnvio: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onSendMessage(`Oferta formal de contratación por $${offerPrice.toLocaleString('es-CO')} COP`, newOffer);
    setShowOfferForm(false);
    setOfferDesc('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-[16px] border border-[#b9bbc6] shadow-xl overflow-hidden flex flex-col h-[650px] max-h-[92vh] animate-scale-in">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-[#f3f3f7] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <img
              src={worker.avatarUrl}
              alt={worker.nombre}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-[10px] object-cover border border-[#b9bbc6]/40"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-black tracking-tight">{worker.nombre}</h3>
                {worker.verificado && (
                  <span title="Verificado">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#ff5900]" />
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#60646c] flex items-center gap-1.5">
                <span>{worker.categoriaNombre.split('(')[0]}</span>
                <span>·</span>
                <span className="text-emerald-600 font-medium">En línea para cotizar</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOfferForm(!showOfferForm)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#ff5900] hover:bg-[#e04f00] rounded-[10px] transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{showOfferForm ? 'Ver conversación' : 'Crear Oferta Formal'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#8b8d98] hover:text-black rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Anti-leak Warning Bar (RF-22) */}
        {antiLeakWarning && (
          <div className="bg-[#fff4ed] border-b border-[#ff5900]/30 px-4 py-2 flex items-center gap-2 text-xs text-[#15191e]">
            <ShieldAlert className="w-4 h-4 text-[#ff5900] shrink-0" />
            <span className="flex-1 text-[11px] leading-tight">{antiLeakWarning}</span>
            <button 
              onClick={() => setAntiLeakWarning(null)}
              className="text-xs font-bold text-[#ff5900] hover:underline cursor-pointer ml-1"
            >
              Entendido
            </button>
          </div>
        )}

        {/* Chat Messages Body or Offer Creator Form */}
        <div className="flex-1 p-4 overflow-y-auto bg-[#f3f3f7] space-y-3">
          
          {showOfferForm ? (
            /* Formal Offer Creation Panel (RF-19) */
            <div className="bg-white rounded-[12px] p-5 border border-[#b9bbc6]/60 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#f3f3f7]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#ff5900]" />
                  <h4 className="text-sm font-bold text-black">Formular Oferta Formal Inmutable</h4>
                </div>
                <span className="text-[11px] text-[#60646c]">Estándar SRS RF-19</span>
              </div>

              <p className="text-xs text-[#60646c]">
                Al enviarse, las partes contarán con términos cerrados. Si se acepta, se creará el contrato con retención de fondos (Escrow).
              </p>

              <form onSubmit={handleCreateOffer} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-black mb-1">
                    Descripción detallada del trabajo / alcance:
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={offerDesc}
                    onChange={(e) => setOfferDesc(e.target.value)}
                    placeholder="Ejemplo: Arreglo de sifón, cambio de llave de paso y pruebas con agua caliente..."
                    className="w-full text-xs p-3 rounded-[10px] border border-[#b9bbc6] focus:border-[#ff5900] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-black mb-1">
                      Precio total en COP (Bruto):
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs text-[#8b8d98]">$</span>
                      <input
                        type="number"
                        min="10000"
                        step="5000"
                        required
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(Number(e.target.value))}
                        className="w-full text-xs pl-7 pr-3 py-2 rounded-[10px] border border-[#b9bbc6] font-bold text-black focus:border-[#ff5900] outline-none tabular-nums"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-black mb-1">
                      Fecha y hora pactada de llegada:
                    </label>
                    <input
                      type="text"
                      required
                      value={offerDateTime}
                      onChange={(e) => setOfferDateTime(e.target.value)}
                      placeholder="Ej: Hoy a las 4:00 PM"
                      className="w-full text-xs p-2 rounded-[10px] border border-[#b9bbc6] text-black focus:border-[#ff5900] outline-none"
                    />
                  </div>
                </div>

                {/* Breakdown preview (RF-28) */}
                <div className="bg-[#f3f3f7] p-3 rounded-[8px] text-xs space-y-1">
                  <div className="flex justify-between text-[#60646c]">
                    <span>Subtotal cliente:</span>
                    <span className="font-semibold text-black tabular-nums">${offerPrice.toLocaleString('es-CO')} COP</span>
                  </div>
                  <div className="flex justify-between text-[#60646c]">
                    <span>Comisión plataforma (10%):</span>
                    <span className="tabular-nums">-${Math.round(offerPrice * 0.1).toLocaleString('es-CO')} COP</span>
                  </div>
                  <div className="flex justify-between text-black font-bold pt-1 border-t border-[#b9bbc6]/30">
                    <span>Neto liquidable al trabajador:</span>
                    <span className="tabular-nums">${Math.round(offerPrice * 0.9).toLocaleString('es-CO')} COP</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowOfferForm(false)}
                    className="px-3 py-2 text-xs font-medium text-black border border-[#b9bbc6] rounded-[10px] hover:bg-[#f3f3f7] cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#ff5900] hover:bg-[#e04f00] rounded-[10px] cursor-pointer"
                  >
                    Enviar Oferta Formal
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Security Advisory Pill in Chat */}
              <div className="text-center my-2">
                <span className="text-[11px] text-[#60646c] bg-white px-3 py-1 rounded-[6px] border border-[#b9bbc6]/40 inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ff5900]" />
                  <span>Chat encriptado. Protegido por el sistema de Escrow de Échele Camello.</span>
                </span>
              </div>

              {/* Message List */}
              {messages.map((msg) => {
                const isMe = msg.remitenteId === currentUser.id;

                if (msg.tipo === 'oferta' && msg.oferta) {
                  const of = msg.oferta;
                  return (
                    <div key={msg.id} className="w-full my-2">
                      <div className="bg-white rounded-[12px] p-4 border-2 border-[#ff5900]/40 shadow-xs max-w-md mx-auto space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-[#f3f3f7]">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#ff5900]">
                            <FileText className="w-4 h-4" />
                            <span>OFERTA FORMAL REGISTRADA (v{of.version})</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[4px] ${
                            of.estado === 'aceptada' ? 'bg-emerald-100 text-emerald-800' :
                            of.estado === 'rechazada' ? 'bg-rose-100 text-rose-800' :
                            'bg-[#fff4ed] text-[#ff5900]'
                          }`}>
                            {of.estado.toUpperCase()}
                          </span>
                        </div>

                        <div className="text-xs text-[#60646c]">
                          <strong>Alcance pactado:</strong> {of.descripcionServicio}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs bg-[#f3f3f7] p-2.5 rounded-[8px]">
                          <div>
                            <span className="text-[10px] text-[#8b8d98] block">Monto pactado</span>
                            <span className="text-sm font-bold text-black tabular-nums">
                              ${of.precioCOP.toLocaleString('es-CO')} COP
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#8b8d98] block">Fecha pactada</span>
                            <span className="text-xs font-semibold text-black">{of.fechaHoraPactada}</span>
                          </div>
                        </div>

                        {/* Interactive Acceptance / Actions (RF-20) */}
                        {of.estado === 'pendiente' ? (
                          <div className="pt-2 border-t border-[#f3f3f7] flex items-center justify-end gap-2">
                            <button
                              onClick={() => onRejectOffer(of.id)}
                              className="px-3 py-1.5 text-xs font-medium text-black border border-[#b9bbc6] rounded-[8px] hover:bg-[#f3f3f7] cursor-pointer"
                            >
                              Rechazar
                            </button>
                            <button
                              onClick={() => {
                                setCounterOfferId(of.id);
                                setCounterPrice(of.precioCOP);
                              }}
                              className="px-3 py-1.5 text-xs font-semibold text-black bg-[#f3f3f7] hover:bg-slate-200 rounded-[8px] cursor-pointer"
                            >
                              Contraofertar
                            </button>
                            <button
                              onClick={() => onAcceptOffer(of)}
                              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#ff5900] hover:bg-[#e04f00] rounded-[8px] cursor-pointer flex items-center gap-1 shadow-xs"
                            >
                              <span>Aceptar y Proceder al Pago</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        ) : of.estado === 'aceptada' ? (
                          <div className="text-xs text-emerald-800 bg-emerald-50 p-2 rounded-[6px] flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Oferta formal aceptada. Contrato registrado en estado "Pendiente de pago".</span>
                          </div>
                        ) : (
                          <div className="text-xs text-[#8b8d98] italic">Oferta no activa ({of.estado}).</div>
                        )}

                        {/* Counter offer subform */}
                        {counterOfferId === of.id && (
                          <div className="p-3 bg-[#f3f3f7] rounded-[8px] space-y-2 mt-2 border border-[#b9bbc6]/50">
                            <div className="text-xs font-bold text-black">Enviar Contraoferta</div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#60646c]">Nuevo precio COP:</span>
                              <input
                                type="number"
                                value={counterPrice}
                                onChange={(e) => setCounterPrice(Number(e.target.value))}
                                className="w-28 text-xs p-1.5 rounded border border-[#b9bbc6] bg-white font-bold"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setCounterOfferId(null)}
                                className="text-xs text-[#60646c] hover:underline"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => {
                                  onCounterOffer(of, counterPrice, counterNotes);
                                  setCounterOfferId(null);
                                }}
                                className="px-3 py-1 text-xs bg-black text-white rounded font-medium cursor-pointer"
                              >
                                Enviar contraoferta
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[78%] rounded-[12px] p-3 text-xs leading-relaxed ${
                        isMe
                          ? 'bg-black text-white rounded-br-xs'
                          : 'bg-white text-black border border-[#b9bbc6]/40 rounded-bl-xs'
                      }`}
                    >
                      <p>{msg.texto}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[#8b8d98] mt-1 px-1">
                      <span>{msg.timestamp}</span>
                      {isMe && <Check className="w-3 h-3 text-[#ff5900]" />}
                    </div>
                  </div>
                );
              })}

              {/* Dynamic typing indicator bubble (SRS RF-13, RF-17) */}
              {isWorkerTyping && (
                <div className="flex flex-col items-start animate-fade-in">
                  <div className="bg-white text-black border border-[#b9bbc6]/50 rounded-[12px] rounded-bl-xs p-3 text-xs flex items-center gap-2 shadow-xs">
                    <span className="text-[11px] text-[#60646c]">{worker.nombre} está escribiendo</span>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff5900] typing-dot-1"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff5900] typing-dot-2"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff5900] typing-dot-3"></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </>
          )}

        </div>

        {/* Input Bar */}
        {!showOfferForm && (
          <form onSubmit={handleSendText} className="p-3 border-t border-[#f3f3f7] bg-white flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Escribe tu mensaje... (los datos de pago se procesan por la app)"
              className="flex-1 text-xs p-2.5 rounded-[10px] border border-[#b9bbc6] focus:border-[#ff5900] outline-none text-black"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-[#ff5900] hover:bg-[#e04f00] text-white rounded-[10px] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
