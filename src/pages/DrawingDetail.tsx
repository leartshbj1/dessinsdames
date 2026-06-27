import { useParams, useNavigate, Link } from "react-router-dom";
import { useGallery } from "../context/GalleryContext";
import { motion } from "motion/react";
import { ArrowLeft, Trash2, ZoomIn, ZoomOut, RotateCcw, RotateCw, RefreshCcw, Maximize, Minimize } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function DrawingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { drawings, deleteDrawing } = useGallery();
  const { user } = useAuth();
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const drawing = drawings.find((d) => d.id === id);

  if (!drawing) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-2xl font-serif">Dessin introuvable</h2>
        <Link to="/" className="text-zinc-400 hover:text-white underline">Retour à la galerie</Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce dessin ?")) {
      deleteDrawing(drawing.id);
      navigate("/");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Link to="/" className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold opacity-60 hover:opacity-100 transition-opacity">
        <ArrowLeft className="w-4 h-4" />
        <span>Retour à la galerie</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-8 bg-white border border-[#2D2D2D] p-2 shadow-[8px_8px_0px_#2D2D2D] md:shadow-[12px_12px_0px_#2D2D2D] flex flex-col"
        >
          <div ref={containerRef} className="w-full bg-[#E5E7EB] flex items-center justify-center overflow-hidden relative" style={{ minHeight: '60vh' }}>
            <motion.img
              src={drawing.imageUrl}
              alt={drawing.title}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ 
                scale, 
                rotate: rotation,
                opacity: imageLoaded ? 1 : 0,
                filter: imageLoaded ? "blur(0px)" : "blur(10px)"
              }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 20,
                opacity: { duration: 0.8 },
                filter: { duration: 0.8 }
              }}
              onLoad={() => setImageLoaded(true)}
              drag
              dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
              className="w-full h-auto object-contain max-h-[70vh] grayscale contrast-125 cursor-grab active:cursor-grabbing"
              style={isFullscreen ? { maxHeight: '100vh' } : {}}
            />
            {isFullscreen && (
              <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 p-2 bg-white/80 border border-[#2D2D2D] hover:bg-[#2D2D2D] hover:text-[#F7F4F0] transition-colors"
                title="Quitter le plein écran"
              >
                <Minimize className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-4 py-2 border-t border-[#2D2D2D]">
            <button onClick={() => setScale(s => Math.min(s + 0.25, 3))} className="p-2 border border-[#2D2D2D] hover:bg-[#2D2D2D] hover:text-[#F7F4F0] transition-colors" title="Zoomer">
              <ZoomIn className="w-5 h-5" />
            </button>
            <button onClick={() => setScale(s => Math.max(s - 0.25, 0.5))} className="p-2 border border-[#2D2D2D] hover:bg-[#2D2D2D] hover:text-[#F7F4F0] transition-colors" title="Dézoomer">
              <ZoomOut className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-[#2D2D2D]"></div>
            <button onClick={() => setRotation(r => r - 90)} className="p-2 border border-[#2D2D2D] hover:bg-[#2D2D2D] hover:text-[#F7F4F0] transition-colors" title="Pivoter à gauche">
              <RotateCcw className="w-5 h-5" />
            </button>
            <button onClick={() => setRotation(r => r + 90)} className="p-2 border border-[#2D2D2D] hover:bg-[#2D2D2D] hover:text-[#F7F4F0] transition-colors" title="Pivoter à droite">
              <RotateCw className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-[#2D2D2D]"></div>
            <button onClick={() => { setScale(1); setRotation(0); }} className="p-2 border border-[#2D2D2D] hover:bg-[#2D2D2D] hover:text-[#F7F4F0] transition-colors" title="Réinitialiser">
              <RefreshCcw className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-[#2D2D2D]"></div>
            <button onClick={toggleFullscreen} className="p-2 border border-[#2D2D2D] hover:bg-[#2D2D2D] hover:text-[#F7F4F0] transition-colors" title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}>
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>

        {/* Details Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-4 space-y-8 lg:sticky lg:top-28"
        >
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif italic font-bold leading-tight">
              {drawing.title}
            </h1>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {drawing.description}
            </p>
          </div>

          <div className="border-l-4 border-[#2D2D2D] pl-6 py-2 space-y-4">
            <h4 className="text-[10px] uppercase font-bold tracking-tighter opacity-60 mb-4">Chronologie du dessin</h4>
            <div className="flex flex-col">
              <span className="text-xs font-mono uppercase">Démarré le</span>
              <span className="text-lg font-serif italic font-bold">{formatDate(drawing.startDate)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono uppercase">Achevé le</span>
              <span className="text-lg font-serif italic font-bold">{formatDate(drawing.endDate)}</span>
            </div>
          </div>

          <div className="pt-8 border-t border-dashed border-[#2D2D2D]">
            {user?.uid === drawing.authorUid && (
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 text-red-600 hover:text-white transition-colors px-4 py-2 border border-red-600 hover:bg-red-600 font-bold text-xs uppercase tracking-widest"
              >
                <Trash2 className="w-4 h-4" />
                <span>Supprimer l'œuvre</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
