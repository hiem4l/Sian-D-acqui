import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { AllergenList } from "./AllergenBadge";
import { getPizzaAllergens } from "../types/allergens";
import { pizzaService } from "../services/api";
import type { Pizza } from "../services/api";

interface PizzaDetailPageProps {
  pizzaId: string;
  onNavigate: (page: string) => void;
}

export function PizzaDetailPage({ pizzaId, onNavigate }: PizzaDetailPageProps) {
  const [pizza, setPizza] = useState<Pizza | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Histoires des pizzas (données statiques)
  const histoires: Record<string, string> = {
    "La Marguerite": "Créée en 1889 à Naples en l'honneur de la Reine Marguerite, elle reprend les couleurs du drapeau italien : rouge (tomate) et blanc (mozzarella).",
    "La Regina": "Appelée aussi 'La Reine', cette pizza tire son nom de sa générosité royale.",
    "La Napo": "Originaire de Naples, cette pizza est un classique incontournable de la cuisine italienne.",
    "La Napolitaine": "Originaire de Naples, cette pizza est un classique incontournable de la cuisine italienne.",
    "La Caprese": "Inspirée du classique salade italienne avec une touche salée.",
    "La Quatre Saisons": "Chaque quart représente une saison avec ses ingrédients signature.",
    "La 4 Saisons": "Chaque quart représente une saison avec ses ingrédients signature.",
    "La Chevre Miel": "Un mariage subtil entre saveurs sucrées et fromage onctueux.",
    "La Chèvre Miel": "Un mariage subtil entre saveurs sucrées et fromage onctueux.",
    "La Calabrese": "Une véritable pizza du sud de l'Italie avec saveurs prononcées.",
    "La Calzone": "La version repliée classique de la pizza, parfaite pour déguster sans se salir.",
    "La Quatre Fromages": "Pour les amateurs de fromage, un délice fromagé à chaque bouchée.",
    "La 4 Fromages": "Pour les amateurs de fromage, un délice fromagé à chaque bouchée.",
    "La Merguez": "Une création gourmande combinant la merguez traditionnelle et les olives.",
    "La Cannibale": "Une pizza moderne et carnivore pour les amateurs de saveurs intenses.",
    "La Lily-Rose": "Une création gourmande combinant saveurs charcutières et fraîcheur.",
    "La Emmy-Lou": "Une création gourmande et équilibrée pour les amateurs de saveurs douces.",
    "La Chris": "Une pizza méditerranéenne avec un twist carnivore en finition.",
    "La Ludmilove": "L'élégance italienne en une pizza avec les meilleurs ingrédients.",
    "La Truffe": "L'apothéose du raffinement, une pizza pour les grandes occasions."
  };

  useEffect(() => {
    const fetchPizza = async () => {
      try {
        setLoading(true);
        const data = await pizzaService.getById(Number(pizzaId));
        setPizza(data);
      } catch (err) {
        setError('Impossible de charger les détails de la pizza');
        console.error('Error fetching pizza:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPizza();
  }, [pizzaId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !pizza) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">{error || 'Pizza non trouvée'}</p>
          <Button onClick={() => onNavigate('menu')} className="mt-4">
            Retour au menu
          </Button>
        </div>
      </div>
    );
  }

  const pizzaAllergens = getPizzaAllergens(pizzaId);
  const histoire = histoires[pizza.name] || "Une délicieuse pizza préparée avec soin par nos pizzaiolos.";

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
      {/* Header */}
      <div className="sticky top-16 z-40 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate('menu')}
            className="flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour au menu
          </Button>
        </div>
      </div>

      {/* Contenu */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* En-tête avec nom et prix */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-primary font-heading">{pizza.name}</h1>
            <span className="text-3xl font-bold text-primary">{pizza.price}€</span>
          </div>

          {/* Photo de la pizza */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="relative h-96 bg-gradient-to-br from-gray-50 to-gray-100">
              {pizza.imageUrl ? (
                <img 
                  src={pizza.imageUrl} 
                  alt={pizza.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                  🍕
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-3 text-gray-900">Description</h2>
            <p className="text-gray-700 text-lg leading-relaxed">{pizza.description}</p>
          </div>

          {/* Allergènes & Intolérances */}
          {pizzaAllergens.length > 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Allergènes & Intolérances
              </h2>
              <AllergenList allergens={pizzaAllergens} size="md" layout="horizontal" />
            </div>
          )}

          {/* Histoire */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-3 text-gray-900">Histoire</h2>
            <p className="text-gray-700 text-lg leading-relaxed">{histoire}</p>
          </div>

          {/* Ingrédients */}
          {pizza.ingredients && pizza.ingredients.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Ingrédients</h2>
              <div className="space-y-3">
                {pizza.ingredients.map((ingredient: any) => (
                  <div 
                    key={ingredient.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {ingredient.imageUrl ? (
                        <img 
                          src={ingredient.imageUrl} 
                          alt={ingredient.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-2xl">🥗</span>
                      )}
                    </div>
                    <span className="text-lg font-medium text-gray-800">{ingredient.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bouton commander */}
          <div className="mt-8 text-center">
            <Button
              size="lg"
              onClick={() => onNavigate('contact')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-12 py-6"
            >
              Commander cette pizza
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}