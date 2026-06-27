import { Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Palette, Info, PlusSquare, Menu, X, BookOpen, LogIn, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signIn, signOut } = useAuth();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Galerie", path: "/", icon: Palette },
    { name: "À propos", path: "/about", icon: Info },
    { name: "Journal", path: "/blog", icon: BookOpen },
    { name: "Ajouter", path: "/add", icon: PlusSquare },
  ];

  return (
    <div className="min-h-screen p-4 md:p-10 font-sans flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto w-full border-[6px] md:border-8 border-[#2D2D2D] p-6 md:p-10 flex flex-col overflow-hidden relative shadow-[8px_8px_0px_rgba(0,0,0,0.1)] bg-[#F7F4F0]">
        
        {/* Navigation Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-baseline mb-8 border-b border-[#2D2D2D] pb-6 gap-6">
          <div className="flex flex-col">
            <Link to="/" className="text-4xl md:text-5xl font-serif italic font-bold tracking-tight uppercase hover:opacity-80 transition-opacity">
              Dessins d'âmes
            </Link>
            <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold mt-2 md:mt-1 opacity-60">
              Portfolio & Galerie Personnelle
            </p>
          </div>

          <div className="flex items-center justify-between w-full md:w-auto">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 uppercase text-xs font-bold tracking-widest">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "transition-opacity py-1",
                    location.pathname === link.path
                      ? "border-b-2 border-[#2D2D2D]"
                      : "opacity-40 hover:opacity-100"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <button onClick={signOut} className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
                  <LogOut className="w-4 h-4" /> Quitter
                </button>
              ) : (
                <button onClick={signIn} className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
                  <LogIn className="w-4 h-4" /> Connexion
                </button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-[#2D2D2D]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-b border-[#2D2D2D] mb-6"
            >
              <nav className="flex flex-col gap-4 uppercase text-xs font-bold tracking-widest pb-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "transition-opacity",
                      location.pathname === link.path
                        ? "text-[#2D2D2D]"
                        : "opacity-40 hover:opacity-100"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                {user ? (
                  <button onClick={signOut} className="text-left opacity-40 hover:opacity-100 transition-opacity">
                    Quitter
                  </button>
                ) : (
                  <button onClick={signIn} className="text-left opacity-40 hover:opacity-100 transition-opacity">
                    Connexion
                  </button>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="mt-12 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest font-bold border-t border-[#2D2D2D] pt-6 gap-4 text-center md:text-left">
          <span>© {new Date().getFullYear()} — Dessins d'âmes</span>
          <span className="opacity-60 hidden md:inline">Toutes les œuvres sont protégées par le droit d'auteur</span>
          <span>Portfolio V.1.0</span>
        </footer>
      </div>
    </div>
  );
}
