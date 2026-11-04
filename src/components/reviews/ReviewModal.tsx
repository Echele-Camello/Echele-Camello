import React, { useState } from 'react';
import { Contract, Review } from '../../types';
import { X, Star, CheckCircle2 } from 'lucide-react';

interface ReviewModalProps {
  contract: Contract;
  onSubmitReview: (reviewData: Partial<Review>) => void;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  contract,
  onSubmitReview,
  onClose
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onSubmitReview({
      contratoId: contract.id,
      autorId: contract.clienteId,
      autorNombre: contract.clienteNombre,
      autorRol: 'cliente',
      destinatarioId: contract.trabajadorId,
      puntuacion: rating,
      comentario: comment.trim(),
      fecha: new Date().toISOString().split('T')[0]
    });

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-[16px] border border-[#b9bbc6] shadow-xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-[#f3f3f7] flex items-center justify-between bg-white">
          <div>
            <h3 className="text-sm font-bold text-black tracking-tight">Calificación y Reseña (RF-32)</h3>
            <p className="text-[11px] text-[#60646c]">Contrato {contract.codigoRadicado}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8b8d98] hover:text-black rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h4 className="text-base font-bold text-black">
              ¡Reseña Publicada con Éxito!
            </h4>

            <p className="text-xs text-[#60646c] leading-relaxed">
              Tu valoración fortalece la reputación y confianza de <strong className="text-black font-semibold">{contract.trabajadorNombre}</strong> en el sector informal.
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
            
            <div className="text-center space-y-2">
              <span className="text-xs text-[#60646c]">
                ¿Cómo calificarías el trabajo realizado por <strong>{contract.trabajadorNombre}</strong>?
              </span>

              {/* Star Rating interactive */}
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= (hoverRating || rating)
                          ? 'fill-[#ff5900] text-[#ff5900]'
                          : 'text-[#b9bbc6]'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="text-xs font-bold text-black">
                {rating === 5 && 'Excelente · Puntual y pulcro'}
                {rating === 4 && 'Muy Bueno · Cumplió expectativas'}
                {rating === 3 && 'Aceptable · Con detalles por mejorar'}
                {rating === 2 && 'Insatisfactorio'}
                {rating === 1 && 'Muy malo · No recomendado'}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">
                Escribe tu reseña detallada (plazo 14 días):
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Menciona la puntualidad, calidad técnica del arreglo, cuidado del espacio y trato..."
                className="w-full text-xs p-3 rounded-[10px] border border-[#b9bbc6] focus:border-[#ff5900] outline-none"
              />
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
                className="px-5 py-2 text-xs font-semibold text-white bg-[#ff5900] hover:bg-[#e04f00] rounded-[10px] cursor-pointer"
              >
                Publicar Reseña
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
