import { Button } from "./ui/button";
import { Construction } from "lucide-react";

interface Props {
  onNavigate: (page: string) => void;
}

export function ContactPage({ onNavigate }: Props) {
  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Commander / Contact</h1>
          <Button onClick={() => onNavigate('home')}>Retour</Button>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-lg p-12 shadow">
          <div className="text-center mb-8">
            <Construction className="w-16 h-16 mx-auto mb-6 text-amber-600" />
            <h2 className="text-2xl font-bold mb-4">Commander par téléphone</h2>
            <p className="text-gray-600 text-lg mb-6">
              Le système de commande en ligne est en cours de développement.
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-amber-50 rounded-lg p-8 border-2 border-red-200">
            <div className="text-center">
              <p className="text-gray-700 text-lg mb-4 font-medium">
                Pour commander, appelez-nous au :
              </p>
              <a 
                href="tel:+33666868370"
                className="inline-flex items-center gap-3 text-4xl font-bold text-red-600 hover:text-red-700 transition-colors group"
              >
                <svg className="w-10 h-10 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>06 66 86 83 70</span>
              </a>
              <p className="text-gray-600 mt-4 text-sm">
                Cliquez sur le numéro pour appeler directement
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
