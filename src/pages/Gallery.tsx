import { useGallery } from "../context/GalleryContext";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Calendar, ArrowRight, Palette } from "lucide-react";

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
      <header className="space-y-4">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-serif italic font-bold tracking-tight uppercase"
        >
          Mes Créations
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm font-bold uppercase tracking-widest opacity-60 leading-relaxed max-w-2xl"
        >
          Bienvenue dans mon univers. Explorez l'évolution de mon trait, de mes premières esquisses à mes œuvres les plus récentes.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {drawings.map((drawing) => (
          <motion.div
            key={drawing.id}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={itemVariants}
            className="group flex flex-col"
          >
            <Link to={`/drawing/${drawing.id}`} className="relative flex-1 bg-white border border-[#2D2D2D] p-2 shadow-[4px_4px_0px_#2D2D2D] hover:shadow-[12px_12px_0px_#2D2D2D] transition-all hover:-translate-y-1 duration-300">
              <div className="w-full aspect-square bg-[#E5E7EB] flex items-center justify-center overflow-hidden">
                <img
                  src={drawing.imageUrl}
                  alt={drawing.title}
                  className="object-cover w-full h-full grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-4 -right-2 md:-right-4 bg-white border border-[#2D2D2D] px-4 md:px-6 py-2 md:py-4 z-10 max-w-[90%]">
                <h3 className="text-xl md:text-2xl font-serif italic font-bold truncate">{drawing.title}</h3>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 mt-1">
                  {new Date(drawing.endDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


