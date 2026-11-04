import React, { useState, useMemo } from 'react';
import { WorkerAnnouncement, WorkerProfile, WorkerCategory, User } from '../../types';
import { 
  MessageSquare, Heart, ShieldCheck, MapPin, Clock, PlusCircle, 
  Search, Filter, Tag, Send, Star, ArrowRight, CheckCircle2, 
  DollarSign, Sparkles, AlertCircle, X 
} from 'lucide-react';

interface WorkerForumViewProps {
  announcements: WorkerAnnouncement[];
  categories: WorkerCategory[];
  currentUser: User;
  workers: WorkerProfile[];
  onOpenChatWithWorker: (workerId: string) => void;
  onAddAnnouncement: (announcement: WorkerAnnouncement) => void;
}

export const WorkerForumView: React.FC<WorkerForumViewProps> = ({
  announcements,
  categories,
  currentUser,
  workers,
  onOpenChatWithWorker,
  onAddAnnouncement
}) => {
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Interactivity
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [localComments, setLocalComments] = useState<Record<string, any[]>>({});

  // Publish Modal State
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCatId, setNewCatId] = useState(categories[0]?.id || 'cat-serv-no-reg');
  const [newCity, setNewCity] = useState('Bogotá D.C.');
  const [newBarrio, setNewBarrio] = useState('');
  const [newPrice, setNewPrice] = useState(45000);
  const [newPriceType, setNewPriceType] = useState<'hora' | 'fijo' | 'a_convenir'>('hora');
  const [newTag, setNewTag] = useState<'urgencias' | 'descuento' | 'disponible_hoy' | 'obra' | 'promocion'>('disponible_hoy');
  const [newHorario, setNewHorario] = useState('Lunes a Sábado: 8:00 AM - 6:00 PM');
  const [customTags, setCustomTags] = useState('Urgencias, Garantía Escrow, A domicilio');

  // Colombian cities list
  const cities = ['Bogotá D.C.', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 'Cartagena', 'Pereira'];

  // Handle Like
  const handleToggleLike = (postId: string) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Handle Comment Submission
  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const newComment = {
      id: `comm-${Date.now()}`,
      autorId: currentUser.id,
      autorNombre: `${currentUser.nombre} ${currentUser.apellido || ''}`.trim(),
      autorAvatar: currentUser.avatarUrl,
      texto: text,
      fecha: 'Justo ahora'
    };

    setLocalComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    setCommentInputs(prev => ({
      ...prev,
      [postId]: ''
    }));

    // Ensure comment thread is open
    setExpandedComments(prev => ({
      ...prev,
      [postId]: true
    }));
  };

  // Handle Publish Submit
  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const catObj = categories.find(c => c.id === newCatId);
    const workerMatching = workers.find(w => w.userId === currentUser.id) || workers[0];

    const tagsArray = customTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const announcementObj: WorkerAnnouncement = {
      id: `anuncio-${Date.now()}`,
      trabajadorId: workerMatching.id,
      trabajadorNombre: currentUser.nombre ? `${currentUser.nombre} ${currentUser.apellido || ''}`.trim() : workerMatching.nombre,
      trabajadorAvatar: currentUser.avatarUrl || workerMatching.avatarUrl,
      trabajadorVerificado: true,
      calificacionPromedio: workerMatching.calificacionPromedio || 4.9,
      titulo: newTitle.trim(),
      descripcion: newDesc.trim(),
      categoriaId: newCatId,
      categoriaNombre: catObj ? catObj.nombre : 'Servicios Varios',
      ciudad: newCity,
      barrio: newBarrio.trim() || 'Zona Metropolitana',
      precioCOP: newPrice,
      tipoPrecio: newPriceType,
      disponibleInmediato: newTag === 'disponible_hoy' || newTag === 'urgencias',
      horario: newHorario.trim(),
      etiqueta: newTag,
      tags: tagsArray.length > 0 ? tagsArray : ['Certificado Escrow'],
      fechaPublicacion: 'Hace 1 minuto',
      likesCount: 1,
      comentarios: []
    };

    onAddAnnouncement(announcementObj);
    setIsPublishModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewDesc('');
  };

  // Filtered Announcements
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(item => {
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const mTitle = item.titulo.toLowerCase().includes(q);
        const mDesc = item.descripcion.toLowerCase().includes(q);
        const mWorker = item.trabajadorNombre.toLowerCase().includes(q);
        const mCat = item.categoriaNombre.toLowerCase().includes(q);
        const mCity = item.ciudad.toLowerCase().includes(q);
        const mTags = item.tags.some(t => t.toLowerCase().includes(q));
        if (!mTitle && !mDesc && !mWorker && !mCat && !mCity && !mTags) return false;
      }

      // Category
      if (selectedCategory !== 'all' && item.categoriaId !== selectedCategory) {
        return false;
      }

      // City
      if (selectedCity !== 'all' && !item.ciudad.toLowerCase().includes(selectedCity.toLowerCase())) {
        return false;
      }

      // Tag filter
      if (selectedTag !== 'all' && item.etiqueta !== selectedTag) {
        return false;
      }

      return true;
    });
  }, [announcements, searchTerm, selectedCategory, selectedCity, selectedTag]);

  return (
    <div className="w-full bg-[#fdfdfd] min-h-screen py-8">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#b9bbc6]/40">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#fff2eb] text-[#ff5900] text-xs font-semibold tracking-wide mb-2">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>FORO COMUNITARIO & ANUNCIOS DE TRABAJADORES</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black">
              Tablón de Anuncios y Ofertas Laborales
            </h1>
            <p className="text-sm text-[#60646c] mt-1 max-w-2xl">
              Especialistas y trabajadores verificados publican disponibilidades inmediatas, promociones y atención a urgencias. Toda contratación está amparada por pago en garantía Escrow.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="bg-[#ff5900] hover:bg-[#e04f00] text-white text-xs md:text-sm font-bold px-4 py-2.5 rounded-[12px] transition-colors cursor-pointer flex items-center gap-2 shadow-xs whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publicar Anuncio</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-[14px] border border-[#b9bbc6]/50 shadow-2xs mb-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-[#8b8d98] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar anuncio por oficio, fuga, chapa, pintura..."
                className="w-full bg-[#f8f9fa] border border-[#b9bbc6]/50 rounded-[10px] pl-10 pr-4 py-2 text-xs md:text-sm text-black placeholder-[#8b8d98] focus:outline-none focus:border-[#ff5900] focus:bg-white transition-all"
              />
            </div>

            {/* City Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-[#f8f9fa] border border-[#b9bbc6]/50 rounded-[10px] px-3 py-2 text-xs font-semibold text-black focus:outline-none focus:border-[#ff5900] cursor-pointer"
              >
                <option value="all">Todas las ciudades</option>
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#f8f9fa] border border-[#b9bbc6]/50 rounded-[10px] px-3 py-2 text-xs font-semibold text-black focus:outline-none focus:border-[#ff5900] cursor-pointer"
              >
                <option value="all">Todos los oficios</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Tag Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-[#b9bbc6]/30 text-xs">
            <span className="text-[#8b8d98] text-[11px] font-bold uppercase tracking-wider shrink-0">
              Etiquetas:
            </span>

            {[
              { id: 'all', label: 'Todos los anuncios' },
              { id: 'disponible_hoy', label: '⚡ Disponible Hoy' },
              { id: 'urgencias', label: '🚨 Urgencias 24/7' },
              { id: 'descuento', label: '🔥 Descuentos y Promos' },
              { id: 'obra', label: '🏗️ Obras y Remodelación' },
              { id: 'promocion', label: '✨ Paquetes Especiales' }
            ].map(tagItem => (
              <button
                key={tagItem.id}
                type="button"
                onClick={() => setSelectedTag(tagItem.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                  selectedTag === tagItem.id
                    ? 'bg-[#ff5900] text-white border-[#ff5900] font-semibold'
                    : 'bg-[#f8f9fa] text-black border-[#b9bbc6]/40 hover:bg-[#eceef2]'
                }`}
              >
                {tagItem.label}
              </button>
            ))}
          </div>
        </div>

        {/* FEED OF ANNOUNCEMENTS */}
        <div className="space-y-5">
          {filteredAnnouncements.length === 0 ? (
            <div className="bg-white border border-[#b9bbc6]/50 rounded-[14px] p-12 text-center shadow-2xs space-y-3">
              <MessageSquare className="w-10 h-10 text-[#8b8d98] mx-auto" />
              <h3 className="text-base font-bold text-black">
                No hay anuncios que coincidan con los filtros seleccionados
              </h3>
              <p className="text-xs text-[#60646c]">
                Sé el primero en publicar un anuncio para esta categoría o ciudad.
              </p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedCity('all'); setSelectedTag('all'); }}
                className="px-4 py-2 bg-[#f3f3f7] hover:bg-[#eceef2] text-xs font-semibold text-black rounded-[10px] transition-colors"
              >
                Restablecer filtros
              </button>
            </div>
          ) : (
            filteredAnnouncements.map((post) => {
              const isLiked = likedPosts[post.id];
              const likesTotal = post.likesCount + (isLiked ? 1 : 0);
              const isCommentsOpen = expandedComments[post.id];
              const combinedComments = [
                ...post.comentarios,
                ...(localComments[post.id] || [])
              ];

              return (
                <article
                  key={post.id}
                  className="bg-white border border-[#b9bbc6]/50 hover:border-[#ff5900]/70 rounded-[14px] p-5 md:p-6 shadow-2xs transition-all space-y-4"
                >
                  {/* Top Bar: Worker info + Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.trabajadorAvatar}
                        alt={post.trabajadorNombre}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover border border-[#b9bbc6]/60 shadow-2xs"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm font-bold text-black">
                            {post.trabajadorNombre}
                          </span>
                          {post.trabajadorVerificado && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-200">
                              <ShieldCheck className="w-3 h-3 text-blue-600" />
                              <span>Verificado Escrow</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#60646c] mt-0.5">
                          <span className="font-medium text-[#ff5900]">{post.categoriaNombre}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1 text-amber-500 font-semibold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{post.calificacionPromedio.toFixed(1)}</span>
                          </div>
                          <span>•</span>
                          <span className="text-[11px] text-[#8b8d98]">{post.fechaPublicacion}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tag badge */}
                    <div className="flex items-center gap-2 shrink-0">
                      {post.etiqueta === 'urgencias' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                          🚨 Urgencias 24/7
                        </span>
                      )}
                      {post.etiqueta === 'disponible_hoy' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          ⚡ Disponible Hoy
                        </span>
                      )}
                      {post.etiqueta === 'descuento' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                          🔥 Descuento Especial
                        </span>
                      )}
                      {post.etiqueta === 'obra' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                          🏗️ Obra y Remodelación
                        </span>
                      )}
                      {post.etiqueta === 'promocion' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                          ✨ Paquete Express
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Body */}
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-black hover:text-[#ff5900] transition-colors leading-snug">
                      {post.titulo}
                    </h2>
                    <p className="text-xs md:text-sm text-[#4b4e56] mt-2 leading-relaxed whitespace-pre-line">
                      {post.descripcion}
                    </p>
                  </div>

                  {/* Location, Schedule & Price Info Box */}
                  <div className="bg-[#f8f9fa] border border-[#b9bbc6]/40 rounded-[10px] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-black font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#ff5900] shrink-0" />
                        <span>{post.ciudad}</span>
                        {post.barrio && (
                          <span className="text-[#60646c]">({post.barrio})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[#60646c]">
                        <Clock className="w-3.5 h-3.5 text-[#8b8d98] shrink-0" />
                        <span>{post.horario}</span>
                      </div>
                    </div>

                    {post.precioCOP && (
                      <div className="sm:text-right shrink-0">
                        <div className="text-[10px] text-[#8b8d98] uppercase font-bold tracking-wider">
                          Tarifa ofrecida
                        </div>
                        <div className="text-base font-extrabold text-black">
                          ${post.precioCOP.toLocaleString('es-CO')}{' '}
                          <span className="text-[11px] font-normal text-[#60646c]">
                            COP {post.tipoPrecio === 'hora' ? '/ hora' : '(pactado)'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tag Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-[#f3f3f7] text-[#60646c] px-2.5 py-0.5 rounded-[6px] border border-[#b9bbc6]/30 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="pt-3 border-t border-[#b9bbc6]/30 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Like button */}
                      <button
                        onClick={() => handleToggleLike(post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer ${
                          isLiked 
                            ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                            : 'hover:bg-[#f3f3f7] text-[#60646c] border border-transparent'
                        }`}
                        title="Me interesa este anuncio"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{likesTotal}</span>
                      </button>

                      {/* Comments toggle button */}
                      <button
                        onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold text-[#60646c] hover:bg-[#f3f3f7] transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#8b8d98]" />
                        <span>
                          {combinedComments.length > 0 
                            ? `${combinedComments.length} preguntas` 
                            : 'Preguntar al trabajador'}
                        </span>
                      </button>
                    </div>

                    {/* Contact & Hire with Escrow CTA */}
                    <button
                      onClick={() => onOpenChatWithWorker(post.trabajadorId)}
                      className="bg-[#ff5900] hover:bg-[#e04f00] text-white text-xs font-bold px-4 py-2 rounded-[10px] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
                      title="Contactar al trabajador y convenir cotización formal con pago custodiado"
                    >
                      <span>Contactar y Contratar con Escrow</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* EXPANDED COMMENTS / Q&A SECTION */}
                  {isCommentsOpen && (
                    <div className="mt-4 pt-4 border-t border-[#b9bbc6]/30 space-y-3 bg-[#fafafc] -mx-5 -mb-5 p-5 rounded-b-[14px]">
                      <div className="text-xs font-bold text-black uppercase tracking-wider">
                        Preguntas y Respuestas Rápidas
                      </div>

                      {combinedComments.length > 0 ? (
                        <div className="space-y-2.5">
                          {combinedComments.map((comm) => (
                            <div key={comm.id} className="bg-white p-3 rounded-[10px] border border-[#b9bbc6]/40 text-xs shadow-2xs">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="font-bold text-black">{comm.autorNombre}</span>
                                <span className="text-[10px] text-[#8b8d98]">{comm.fecha}</span>
                              </div>
                              <p className="text-[#4b4e56] leading-relaxed">{comm.texto}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[#8b8d98] italic">
                          Aún no hay preguntas. Si tienes dudas sobre zona o herramientas, escribe abajo.
                        </p>
                      )}

                      {/* Comment Input */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment(post.id);
                          }}
                          placeholder="Escribe una pregunta rápida sobre el servicio..."
                          className="flex-1 bg-white border border-[#b9bbc6] rounded-[10px] px-3 py-2 text-xs text-black placeholder-[#8b8d98] focus:outline-none focus:border-[#ff5900]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddComment(post.id)}
                          className="bg-black hover:bg-zinc-800 text-white p-2 rounded-[10px] transition-colors cursor-pointer shrink-0"
                          title="Enviar comentario"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                </article>
              );
            })
          )}
        </div>

      </div>

      {/* MODAL: PUBLICAR NUEVO ANUNCIO (FORO) */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[16px] border border-[#b9bbc6] max-w-lg w-full p-6 shadow-2xl relative my-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#b9bbc6]/40">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#ff5900] rounded-sm flex items-center justify-center text-white text-xs font-black">
                  EC
                </div>
                <div>
                  <h3 className="text-base font-bold text-black">
                    Publicar Anuncio en el Foro
                  </h3>
                  <p className="text-[11px] text-[#60646c]">
                    Ofrece tus servicios a la comunidad con respaldo Escrow
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="text-[#8b8d98] hover:text-black p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishSubmit} className="space-y-4 mt-4">
              
              {/* Titulo */}
              <div>
                <label className="text-xs font-bold text-black uppercase tracking-wider block mb-1">
                  Título del Anuncio *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Destapes con sonda eléctrica y detección de fugas hoy en Chapinero"
                  className="w-full bg-[#f8f9fa] border border-[#b9bbc6] rounded-[10px] px-3 py-2 text-xs text-black focus:outline-none focus:border-[#ff5900] focus:bg-white"
                />
              </div>

              {/* Categoría y Ciudad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-black uppercase tracking-wider block mb-1">
                    Oficio / Rol *
                  </label>
                  <select
                    value={newCatId}
                    onChange={(e) => setNewCatId(e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-[#b9bbc6] rounded-[10px] px-3 py-2 text-xs font-medium text-black focus:outline-none focus:border-[#ff5900]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-black uppercase tracking-wider block mb-1">
                    Ciudad *
                  </label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-[#b9bbc6] rounded-[10px] px-3 py-2 text-xs font-medium text-black focus:outline-none focus:border-[#ff5900]"
                  >
                    {cities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Barrio y Etiqueta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-black uppercase tracking-wider block mb-1">
                    Barrios o Zonas de cobertura
                  </label>
                  <input
                    type="text"
                    value={newBarrio}
                    onChange={(e) => setNewBarrio(e.target.value)}
                    placeholder="Ej: Teusaquillo, Salitre, Centro"
                    className="w-full bg-[#f8f9fa] border border-[#b9bbc6] rounded-[10px] px-3 py-2 text-xs text-black focus:outline-none focus:border-[#ff5900]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-black uppercase tracking-wider block mb-1">
                    Tipo de Anuncio
                  </label>
                  <select
                    value={newTag}
                    onChange={(e: any) => setNewTag(e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-[#b9bbc6] rounded-[10px] px-3 py-2 text-xs font-medium text-black focus:outline-none focus:border-[#ff5900]"
                  >
                    <option value="disponible_hoy">⚡ Disponible Hoy</option>
                    <option value="urgencias">🚨 Urgencias 24/7</option>
                    <option value="descuento">🔥 Descuento / Oferta</option>
                    <option value="obra">🏗️ Obra y Remodelación</option>
                    <option value="promocion">✨ Paquete Express</option>
                  </select>
                </div>
              </div>

              {/* Tarifa COP y Horario */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-black uppercase tracking-wider block mb-1">
                    Tarifa Estimada (COP) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-[#8b8d98]">$</span>
                    <input
                      type="number"
                      step="5000"
                      min="15000"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full bg-[#f8f9fa] border border-[#b9bbc6] rounded-[10px] pl-7 pr-3 py-2 text-xs font-bold text-black focus:outline-none focus:border-[#ff5900]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-black uppercase tracking-wider block mb-1">
                    Disponibilidad / Horario
                  </label>
                  <input
                    type="text"
                    value={newHorario}
                    onChange={(e) => setNewHorario(e.target.value)}
                    placeholder="Ej: Hoy hasta las 8:00 PM"
                    className="w-full bg-[#f8f9fa] border border-[#b9bbc6] rounded-[10px] px-3 py-2 text-xs text-black focus:outline-none focus:border-[#ff5900]"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="text-xs font-bold text-black uppercase tracking-wider block mb-1">
                  Descripción del Servicio o Promoción *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Detalla qué incluye el servicio, herramientas que llevas, garantía ofrecida..."
                  className="w-full bg-[#f8f9fa] border border-[#b9bbc6] rounded-[10px] p-3 text-xs text-black focus:outline-none focus:border-[#ff5900] focus:bg-white"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-bold text-black uppercase tracking-wider block mb-1">
                  Etiquetas separadas por coma
                </label>
                <input
                  type="text"
                  value={customTags}
                  onChange={(e) => setCustomTags(e.target.value)}
                  placeholder="Ej: Domicilio, Sonda eléctrica, Retie"
                  className="w-full bg-[#f8f9fa] border border-[#b9bbc6] rounded-[10px] px-3 py-2 text-xs text-black focus:outline-none focus:border-[#ff5900]"
                />
              </div>

              {/* Escrow Notice */}
              <div className="bg-[#fff2eb] border border-[#ff5900]/30 rounded-[10px] p-3 text-xs text-[#60646c] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#ff5900] shrink-0 mt-0.5" />
                <span>
                  Todos los contactos a través de este anuncio se formalizan con contrato digital y garantía de pago custodiado Escrow para seguridad mutua.
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#b9bbc6]/40">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-black hover:bg-[#f3f3f7] rounded-[10px] transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ff5900] hover:bg-[#e04f00] text-white text-xs font-bold rounded-[10px] transition-colors cursor-pointer shadow-xs"
                >
                  Publicar en el Foro
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
