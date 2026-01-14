import { Separator } from "./ui/separator";
import { useState } from "react";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState("");

  // Note: Newsletter submission currently disabled - just to remove unused handler warning
  void email;
  void setEmail;

  const quickLinks = [
    { label: "Accueil", value: "home" },
    { label: "Menu", value: "menu" },
    { label: "Contact", value: "contact" },
  ];

  // const resources = [
  //   "Documentation",
  //   "FAQ",
  //   "Startup Guide",
  //   "Legal Resources",
  // ];

  return (
    <footer className="border-t border-amber-950" style={{backgroundColor: '#3d2817'}} role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* À propos */}
          <section className="space-y-4" aria-labelledby="about-section">
            <h2 id="about-section" className="font-bold text-2xl tracking-wide text-amber-300">
              Pizzeria Sian D'Acqui
            </h2>
            <p className="text-sm text-amber-50">
              Pizzeria artisanale à Saint-Roman-de-Bellet. 
              Pizzas au feu de bois avec des ingrédients frais et locaux.
              Venez découvrir nos spécialités italiennes authentiques.
            </p>
          </section>

          {/* Contact */}
          <section className="space-y-4" aria-labelledby="contact-section">
            <h3 id="contact-section" className="font-medium text-amber-100">Contact</h3>
            <div className="space-y-2">
              <a 
                href="tel:+33666868370" 
                className="flex items-center gap-2 text-amber-50 hover:text-amber-300 transition-colors group"
              >
                <svg className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="font-medium">06 66 86 83 70</span>
              </a>
            </div>
          </section>

          {/* Navigation */}
          <section className="space-y-4" aria-labelledby="nav-section">
            <h3 id="nav-section" className="font-medium text-amber-100">Navigation</h3>
            <nav>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.value}>
                    <button
                      onClick={() => onNavigate(link.value)}
                      className="text-sm text-amber-100 hover:text-amber-300 transition-colors focus-outline"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </section>
        </div>

        <Separator className="my-8" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-amber-200">
          <span>
            © 2025 Pizzeria Sian D'Acqui — Tous droits réservés
          </span>
          <nav className="flex space-x-4" aria-label="Liens légaux">
            <button className="hover:text-amber-500 transition-colors focus-outline" aria-label="Voir les mentions légales">
              Mentions légales
            </button>
            <button className="hover:text-foreground transition-colors focus-outline" aria-label="Voir la politique de confidentialité">
              Confidentialité
            </button>
            <button className="hover:text-amber-500 transition-colors focus-outline" aria-label="Voir les conditions d'utilisation">
              Conditions
            </button>
            <button 
              onClick={() => onNavigate('admin')} 
              className="hover:text-amber-300 transition-colors focus-outline text-xs opacity-70" 
              aria-label="Accès administration"
            >
              Admin
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}