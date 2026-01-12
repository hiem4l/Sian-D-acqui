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

        <div className="max-w-2xl mx-auto bg-white rounded-lg p-12 shadow text-center">
          <Construction className="w-16 h-16 mx-auto mb-6 text-amber-600" />
          <h2 className="text-2xl font-bold mb-4">Page en cours de développement</h2>
          <p className="text-gray-600 text-lg">
            Le système de commande et de contact est actuellement en travaux.
            <br />
            Revenez bientôt !
          </p>
        </div>
      </div>
    </div>
  );
}
