import { motion } from "motion/react";

export default function About() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-10"
        >
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-serif italic font-bold tracking-tight uppercase">
              À propos de moi
            </h1>
            <h2 className="text-xl md:text-2xl font-serif italic opacity-60">
              Une passion née d'un simple coup de crayon.
            </h2>
          </div>

          <div className="space-y-6 leading-relaxed text-sm">
            <p>
              Je dessine depuis que je suis enfant. Ce qui n'était au départ qu'un passe-temps 
              est rapidement devenu un moyen d'expression vital. À travers mes dessins, j'essaie 
              de capturer l'émotion d'un instant, la beauté d'une ligne architecturale, ou la 
              profondeur d'un regard.
            </p>
            <p>
              Mon médium préféré est le crayon graphite et le fusain, car ils offrent une 
              liberté totale entre précision chirurgicale et chaos expressif.
            </p>
            <p>
              Cette galerie est un espace personnel que j'ai créé pour archiver mon évolution, 
              suivre le temps passé sur chaque œuvre (car certaines prennent des semaines !), et 
              partager ma vision du monde avec vous.
            </p>
          </div>

          <div className="pt-6 border-t border-[#2D2D2D]">
            <p className="font-serif text-2xl italic font-bold">
              "L'art ne reproduit pas le visible, il rend visible."
            </p>
            <p className="mt-4 text-[10px] uppercase font-bold tracking-widest opacity-60">— Paul Klee</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-white border border-[#2D2D2D] p-2 shadow-[12px_12px_0px_#2D2D2D]"
        >
          <div className="aspect-[3/4] overflow-hidden bg-[#E5E7EB]">
            <img
              src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop"
              alt="Art tools"
              className="object-cover w-full h-full grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
