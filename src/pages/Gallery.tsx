import { useGallery } from "../context/GalleryContext";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Palette, Sparkles, Clock, Paintbrush } from "lucide-react";
import { useState } from "react";

const FadeInImage = ({ src, alt, className }: { src: string, alt: string, className: string }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: loaded ? 1 : 0, filter: loaded ? "blur(0px)" : "blur(10px)" }}
      transition={{ duration: 0.8 }}
      onLoad={() => setLoaded(true)}
      loading="lazy"
    />
  );
};

export default function Gallery() {
  const { drawings } = useGallery();

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  if (drawings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 border border-[#2D2D2D] bg-white p-10 shadow-[12px_12px_0px_#2D2D2D]">
        <div className="w-16 h-16 flex items-center justify-center border-b-2 border-[#2D2D2D]">
          <Palette className="w-8 h-8 text-[#2D2D2D]" />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-serif italic font-bold">La galerie est vide</h2>
          <p className="text-sm uppercase tracking-widest opacity-60 max-w-md mx-auto">Votre espace de création attend sa première œuvre. Commencez à partager votre passion.</p>
        </div>
        <Link
          to="/add"
          className="px-6 py-3 border border-[#2D2D2D] bg-[#2D2D2D] text-white text-xs uppercase font-bold tracking-widest hover:bg-[#F7F4F0] hover:text-[#2D2D2D] transition-colors"
        >
          Ajouter mon premier dessin
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="relative border-b-2 border-[#2D2D2D] pb-12 mb-12">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Sparkles className="w-64 h-64 text-[#2D2D2D]" />
        </div>
        
        <header className="space-y-6 max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 border border-[#2D2D2D] bg-white text-[10px] uppercase font-bold tracking-widest"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            En exposition continue
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif italic font-bold tracking-tight uppercase leading-[0.9]"
          >
            Mes <br/>Créations
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm font-bold uppercase tracking-widest opacity-70 leading-relaxed max-w-2xl border-l-4 border-[#2D2D2D] pl-4"
          >
            Bienvenue dans mon univers. Explorez l'évolution de mon trait, de mes premières esquisses à mes œuvres les plus récentes.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex gap-6 pt-4"
          >
            <div className="flex items-center gap-2 text-xs uppercase font-bold opacity-60">
              <Paintbrush className="w-4 h-4" />
              <span>{drawings.length} Œuvres</span>
            </div>
            <div className="flex items-center gap-2 text-xs uppercase font-bold opacity-60">
              <Clock className="w-4 h-4" />
              <span>Depuis {new Date(Math.min(...drawings.map(d => new Date(d.endDate).getTime()))).getFullYear() || new Date().getFullYear()}</span>
            </div>
          </motion.div>
        </header>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
        {drawings.map((drawing) => (
          <motion.div
            key={drawing.id}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={itemVariants}
            className="group flex flex-col"
          >
            <Link to={`/drawing/${drawing.id}`} className="relative flex-1 bg-white border-2 border-[#2D2D2D] p-3 shadow-[6px_6px_0px_#2D2D2D] hover:shadow-[12px_12px_0px_#2D2D2D] transition-all hover:-translate-y-2 duration-300 flex flex-col">
              <div className="w-full aspect-[4/5] bg-[#E5E7EB] flex items-center justify-center overflow-hidden border border-[#2D2D2D]/20 relative">
                <div className="absolute inset-0 bg-[#2D2D2D]/0 group-hover:bg-[#2D2D2D]/10 transition-colors z-10"></div>
                <FadeInImage
                  src={drawing.imageUrl}
                  alt={drawing.title}
                  className="object-cover w-full h-full grayscale-[0.8] contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="pt-4 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-serif italic font-bold line-clamp-2 leading-tight group-hover:text-blue-900 transition-colors">{drawing.title}</h3>
                </div>
                <div className="flex items-center justify-between border-t border-[#2D2D2D] pt-3">
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">
                    {new Date(drawing.endDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                  </p>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-right bg-[#2D2D2D] text-white px-2 py-1">
                    Voir →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


