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
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center gap-8 p-4 md:p-8">
        {/* Menu Section */}
        <div className="text-center transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white font-heading drop-shadow-lg">Notre Menu</h2>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white text-red-600 hover:bg-red-50 border-2 border-white font-bold text-lg px-8 py-6"
            onClick={() => onNavigate('menu')}
          >
            Voir la carte
          </Button>
        </div>

        {/* Commander Section */}
        <div className="text-center transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white font-heading drop-shadow-lg">Commander</h2>
          <Button 
            size="lg" 
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-6"
            onClick={() => onNavigate('contact')}
          >
            Passer commande
          </Button>
        </div>
      </div>
    </div>
  );
}
