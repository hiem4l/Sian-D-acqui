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
  );
}
