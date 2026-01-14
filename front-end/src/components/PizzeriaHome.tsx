import { Button } from "./ui/button";

interface Props {
  onNavigate: (page: string) => void;
}

export function PizzeriaHome({ onNavigate }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <img 
        src="/images/commander2.jpg" 
        alt="Pizzeria Sian D'Acqui" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="flex flex-col items-center gap-8 md:gap-12">
          {/* Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white text-center tracking-wide">
            <span className="inline-block transform hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
              Sian D'Acqui
            </span>
          </h1>
          
          {/* Phone Number */}
          <a 
            href="tel:+33666868370"
            className="flex items-center gap-3 text-2xl md:text-3xl font-semibold text-white hover:text-amber-300 transition-colors group"
          >
            <svg className="w-7 h-7 md:w-8 md:h-8 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span className="drop-shadow-lg">06 66 86 83 70</span>
          </a>
          
          {/* Buttons Container - Stacked on mobile, side by side on desktop */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white text-red-600 hover:bg-red-50 border-2 border-white font-bold text-lg px-8 py-6 transform hover:scale-105 transition-transform duration-300"
              onClick={() => onNavigate('menu')}
            >
              Voir la carte
            </Button>

            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-6 transform hover:scale-105 transition-transform duration-300"
              onClick={() => onNavigate('contact')}
            >
              Passer commande
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
