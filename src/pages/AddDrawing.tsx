import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useGallery } from "../context/GalleryContext";
import { motion } from "motion/react";
import { ImagePlus, Loader2, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AddDrawing() {
  const navigate = useNavigate();
  const { addDrawing } = useGallery();
  const { user, signIn } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        alert("L'image est trop volumineuse (max 800Ko pour Firestore). Veuillez la compresser.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!previewUrl) {
      alert("Veuillez sélectionner une image.");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate slight delay for nice UX
    await new Promise(r => setTimeout(r, 600));

    try {
      addDrawing({
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        imageUrl: previewUrl,
      });
      navigate("/");
    } catch (error) {
      alert("Erreur lors de l'ajout. Peut-être que le stockage local est plein.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 border border-[#2D2D2D] bg-white p-10 shadow-[12px_12px_0px_#2D2D2D]">
        <div className="w-16 h-16 flex items-center justify-center border-b-2 border-[#2D2D2D]">
          <LogIn className="w-8 h-8 text-[#2D2D2D]" />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-serif italic font-bold">Authentification requise</h2>
          <p className="text-sm uppercase tracking-widest opacity-60 max-w-md mx-auto">Veuillez vous connecter pour ajouter des œuvres à la galerie.</p>
        </div>
        <button
          onClick={signIn}
          className="px-6 py-3 border border-[#2D2D2D] bg-[#2D2D2D] text-white text-xs uppercase font-bold tracking-widest hover:bg-[#F7F4F0] hover:text-[#2D2D2D] transition-colors"
        >
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif italic font-bold tracking-tight uppercase">Ajouter une Œuvre</h1>
          <p className="text-xs font-bold uppercase tracking-widest opacity-60">Partagez votre nouvelle création dans la galerie.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-10 border border-[#2D2D2D] shadow-[8px_8px_0px_#2D2D2D]">
          
          {/* Image Upload Area */}
          <div 
            className={`border-2 border-dashed p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${previewUrl ? 'border-[#2D2D2D] bg-[#F7F4F0]' : 'border-[#2D2D2D] hover:bg-[#F7F4F0] bg-white'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            
            {previewUrl ? (
              <div className="relative w-full aspect-video md:aspect-[21/9]">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain grayscale contrast-125" />
                <div className="absolute inset-0 bg-white/80 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[#2D2D2D] font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    <ImagePlus className="w-5 h-5" /> Changer l'image
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-8">
                <div className="w-16 h-16 border border-[#2D2D2D] flex items-center justify-center mx-auto text-[#2D2D2D]">
                  <ImagePlus className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-[#2D2D2D] font-bold text-xs uppercase tracking-widest">Cliquez pour uploader un dessin</p>
                  <p className="text-[#2D2D2D] text-[10px] uppercase tracking-widest mt-2 opacity-60">PNG, JPG ou WEBP (Max 800Ko)</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-[10px] uppercase font-bold tracking-widest opacity-60">Titre de l'œuvre</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-[#F7F4F0] border border-[#2D2D2D] px-4 py-3 text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#2D2D2D]/20 transition-all font-serif italic"
                placeholder="Ex: Portrait au fusain"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-[10px] uppercase font-bold tracking-widest opacity-60">Description ou ressenti</label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-[#F7F4F0] border border-[#2D2D2D] px-4 py-3 text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#2D2D2D]/20 transition-all resize-none text-sm leading-relaxed"
                placeholder="Racontez l'histoire de ce dessin, la technique utilisée..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="startDate" className="block text-[10px] uppercase font-bold tracking-widest opacity-60">Date de début</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full bg-[#F7F4F0] border border-[#2D2D2D] px-4 py-3 text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#2D2D2D]/20 transition-all font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="endDate" className="block text-[10px] uppercase font-bold tracking-widest opacity-60">Date de fin</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  required
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full bg-[#F7F4F0] border border-[#2D2D2D] px-4 py-3 text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#2D2D2D]/20 transition-all font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#2D2D2D] flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !previewUrl}
              className="bg-[#2D2D2D] text-white border border-[#2D2D2D] px-8 py-4 font-bold text-xs uppercase tracking-widest flex items-center space-x-2 hover:bg-[#F7F4F0] hover:text-[#2D2D2D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>Publier l'œuvre</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
