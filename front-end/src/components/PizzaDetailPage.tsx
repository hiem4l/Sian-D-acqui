import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { AllergenList } from "./AllergenBadge";
import { getPizzaAllergens } from "../types/allergens";
import { pizzaService } from "../services/api";

interface PizzaDetailPageProps {
  pizzaId: string;
  onNavigate: (page: string) => void;
}

interface PizzaData {
  id: number;
  name: string;
  price: string;
  description: string;
  imageUrl: string | null;
  ingredients: Array<{
    id: number;
    name: string;
    imageUrl: string | null;
  }>;
}

export function PizzaDetailPage({ pizzaId, onNavigate }: PizzaDetailPageProps) {
  const [pizza, setPizza] = useState<PizzaData | null>(null);
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
                {pizza.ingredients.map((ingredient) => (
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
    "1": {
      id: "1",
      name: "La Marguerite",
      price: "10.00€",
      description: "La pizza classique italienne par excellence, simple et authentique.",
      histoire: "Créée en 1889 à Naples en l'honneur de la Reine Marguerite, elle reprend les couleurs du drapeau italien : rouge (tomate), blanc (mozzarella) et vert (basilic).",
      ingredients: [
        { name: "Sauce tomate maison", image: "/images/ingredients/tomate.svg" },
        { name: "Mozzarella Fior di Latte", image: "/images/ingredients/mozzarella.svg" }
      ],
      image: "/images/pizzas/marguerite.jpg"
    },
    "2": {
      id: "2",
      name: "La Regina",
      price: "13.00€",
      description: "Une pizza généreuse et savoureuse, parfaite pour les amateurs de classiques.",
      histoire: "Appelée aussi 'La Reine', cette pizza tire son nom de sa générosité royale.",
      ingredients: [
        { name: "Sauce tomate maison", image: "/images/ingredients/tomate.svg" },
        { name: "Mozzarella Fior di Latte", image: "/images/ingredients/mozzarella.svg" },
        { name: "Jambon blanc", image: "/images/ingredients/jambon.svg" },
        { name: "Champignons", image: "/images/ingredients/champignons.svg" },
        { name: "Origan", image: "/images/ingredients/origan.svg" },
        { name: "Olives", image: "/images/ingredients/olives.svg" }
      ],
      image: "/images/pizzas/regina.jpg"
    },
    "3": {
      id: "3",
      name: "La Napo",
      price: "14.00€",
      description: "L'authentique pizza napolitaine, simple mais savoureuse avec ses anchois fins.",
      histoire: "Originaire de Naples, cette pizza est un classique incontournable de la cuisine italienne.",
      ingredients: [
        { name: "Sauce tomate maison", image: "/images/ingredients/tomate.svg" },
        { name: "Mozzarella Fior di Latte", image: "/images/ingredients/mozzarella.svg" },
        { name: "Anchois", image: "/images/ingredients/anchois.svg" },
        { name: "Ail", image: "/images/ingredients/ail.svg" }
      ],
      image: "/images/pizzas/napolitaine.jpg"
    },
    "4": {
      id: "4",
      name: "La Caprese",
      price: "14.00€",
      description: "Une variation caprese avec anchois et câpres.",
      histoire: "Inspirée du classique salade italienne avec une touche salée.",
      ingredients: [
        { name: "Sauce tomate maison", image: "/images/ingredients/tomate.svg" },
        { name: "Anchois", image: "/images/ingredients/anchois.svg" },
        { name: "Câpres", image: "/images/ingredients/capres.svg" },
        { name: "Ail", image: "/images/ingredients/ail.svg" }
      ],
      image: "/images/pizzas/caprese.jpg"
    },
    "5": {
      id: "5",
      name: "La 4 Saisons",
      price: "14.00€",
      description: "Une pizza classique avec quatre saisons de saveurs différentes.",
      histoire: "Chaque quart représente une saison avec ses ingrédients signature.",
      ingredients: [
        { name: "Sauce tomate maison", image: "/images/ingredients/tomate.svg" },
        { name: "Mozzarella fior di latte", image: "/images/ingredients/mozzarella.svg" },
        { name: "Courgettes", image: "/images/ingredients/courgettes.svg" },
        { name: "Jambon cuit supérieur", image: "/images/ingredients/jambon.svg" },
        { name: "Poivrons grillés à l'huile", image: "/images/ingredients/poivrons.svg" },
        { name: "Olives", image: "/images/ingredients/olives.svg" },
        { name: "Origan", image: "/images/ingredients/origan.svg" }
      ],
      image: "/images/pizzas/4saisons.jpg"
    },
    "6": {
      id: "6",
      name: "La Chevre Miel",
      price: "14.00€",
      description: "Une pizza gourmande avec chèvre, miel et crème de balsamique.",
      histoire: "Un mariage subtil entre saveurs sucrées et fromage onctueux.",
      ingredients: [
        { name: "Crème fraîche", image: "/images/ingredients/creme.svg" },
        { name: "Mozzarella fior di latte", image: "/images/ingredients/mozzarella.svg" },
        { name: "Chèvre", image: "/images/ingredients/chevre.svg" },
        { name: "Miel", image: "/images/ingredients/miel.svg" },
        { name: "Crème de balsamique", image: "/images/ingredients/balsamique.svg" }
      ],
      image: "/images/pizzas/chevre-miel.jpg"
    },
    "7": {
      id: "7",
      name: "La Calabrese",
      price: "15.00€",
      description: "Une pizza épicée avec spianata et guanciale.",
      histoire: "Une véritable pizza du sud de l'Italie avec saveurs prononcées.",
      ingredients: [
        { name: "Sauce tomate maison", image: "/images/ingredients/tomate.svg" },
        { name: "Mozzarella fior di latte", image: "/images/ingredients/mozzarella.svg" },
        { name: "Spianata", image: "/images/ingredients/spianata.svg" },
        { name: "Guanciale", image: "/images/ingredients/guanciale.svg" }
      ],
      image: "/images/pizzas/calabrese.jpg"
    },
    "8": {
      id: "8",
      name: "La Calzone",
      price: "14.00€",
      description: "Un calzone traditionnel avec œuf et jambon.",
      histoire: "La version repliée classique de la pizza, parfaite pour déguster sans se salir.",
      ingredients: [
        { name: "Sauce tomate maison", image: "/images/ingredients/tomate.svg" },
        { name: "Mozzarella fior di latte", image: "/images/ingredients/mozzarella.svg" },
        { name: "Œuf", image: "/images/ingredients/oeuf.svg" },
        { name: "Jambon", image: "/images/ingredients/jambon.svg" }
      ],
      image: "/images/pizzas/calzone.jpg"
    },
    "9": {
      id: "9",
      name: "La 4 Fromages",
      price: "14.00€",
      description: "Une pizza riche et savoureuse avec quatre fromages différents.",
      histoire: "Pour les amateurs de fromage, un délice fromagé à chaque bouchée.",
      ingredients: [
        { name: "Mozzarella fior di latte", image: "/images/ingredients/mozzarella.svg" },
        { name: "Roquefort", image: "/images/ingredients/roquefort.svg" },
        { name: "Chèvre", image: "/images/ingredients/chevre.svg" },
        { name: "Parmesan", image: "/images/ingredients/parmesan.svg" }
      ],
      image: "/images/pizzas/4fromages.jpg"
    },
    "10": {
      id: "10",
      name: "La Merguez",
      price: "14.00€",
      description: "Une pizza savoureuse avec merguez du boucher et olives.",
      histoire: "Une création gourmande combinant la merguez traditionnelle et les olives.",
      ingredients: [
        { name: "Sauce tomate maison", image: "/images/ingredients/tomate.svg" },
        { name: "Mozzarella Fior di Latte", image: "/images/ingredients/mozzarella.svg" },
        { name: "Merguez du boucher", image: "/images/ingredients/merguez.svg" },
        { name: "Olives", image: "/images/ingredients/olives.svg" }
      ],
      image: "/images/pizzas/merguez.jpg"
    },
    "11": {
      id: "11",
      name: "La Cannibale",
      price: "15.00€",
      description: "Une pizza généreuse avec viande hachée Angus, poivrons et sauce chimichuri.",
      histoire: "Une pizza moderne et carnivore pour les amateurs de saveurs intenses.",
      ingredients: [
        { name: "Sauce tomate maison", image: "/images/ingredients/tomate.svg" },
        { name: "Mozzarella fior di latte", image: "/images/ingredients/mozzarella.svg" },
        { name: "Viande hachée Angus", image: "/images/ingredients/viande.svg" },
        { name: "Poivrons grillés", image: "/images/ingredients/poivrons.svg" },
        { name: "Sauce chimichuri", image: "/images/ingredients/chimichuri.svg" }
      ],
      image: "/images/pizzas/cannibale.jpg"
    },
    "12": {
      id: "12",
      name: "La Lily-Rose",
      price: "15.00€",
      description: "Une pizza raffinée avec burrata, mortadelle et finitions fraîches.",
      histoire: "Une création gourmande combinant saveurs charcutières et fraîcheur.",
      ingredients: [
        { name: "Sauce tomate maison", image: "/images/ingredients/tomate.svg" },
        { name: "Tomates cerises (après cuisson)", image: "/images/ingredients/tomates.svg" },
        { name: "Mesclun", image: "/images/ingredients/mesclun.svg" },
        { name: "Burrata", image: "/images/ingredients/burrata.svg" },
        { name: "Parmesan", image: "/images/ingredients/parmesan.svg" },
        { name: "Mortadelle", image: "/images/ingredients/mortadelle.svg" },
        { name: "Basilic", image: "/images/ingredients/basilic.svg" },
        { name: "Olives", image: "/images/ingredients/olives.svg" }
      ],
      image: "/images/pizzas/lily-rose.jpg"
    },
    "13": {
      id: "13",
      name: "La Emmy-Lou",
      price: "15.00€",
      description: "Une pizza légère avec courgettes, ricotta et pistou.",
      histoire: "Une création gourmande et équilibrée pour les amateurs de saveurs douces.",
      ingredients: [
        { name: "Sauce tomate maison", image: "/images/ingredients/tomate.svg" },
        { name: "Mozzarella fior di latte", image: "/images/ingredients/mozzarella.svg" },
        { name: "Courgettes", image: "/images/ingredients/courgettes.svg" },
        { name: "Ricotta", image: "/images/ingredients/ricotta.svg" },
        { name: "Pistou", image: "/images/ingredients/pistou.svg" }
      ],
      image: "/images/pizzas/emmy-lou.jpg"
    },
    "14": {
      id: "14",
      name: "La Chris",
      price: "15.00€",
      description: "Une pizza végétale avec aubergines, courgettes et jambon cru en finition.",
      histoire: "Une pizza méditerranéenne avec un twist carnivore en finition.",
      ingredients: [
        { name: "Sauce tomate maison", image: "/images/ingredients/tomate.svg" },
        { name: "Aubergines", image: "/images/ingredients/aubergines.svg" },
        { name: "Courgettes", image: "/images/ingredients/courgettes.svg" },
        { name: "Basilic", image: "/images/ingredients/basilic.svg" },
        { name: "Parmesan", image: "/images/ingredients/parmesan.svg" },
        { name: "Jambon cru (après cuisson)", image: "/images/ingredients/jambon-cru.svg" }
      ],
      image: "/images/pizzas/chris.jpg"
    },
    "15": {
      id: "15",
      name: "La Ludmilove",
      price: "15.00€",
      description: "Une pizza raffinée avec roquette et jambon de Parme.",
      histoire: "L'élégance italienne en une pizza avec les meilleurs ingrédients.",
      ingredients: [
        { name: "Sauce tomate maison", image: "/images/ingredients/tomate.svg" },
        { name: "Mozzarella fior di latte", image: "/images/ingredients/mozzarella.svg" },
        { name: "Roquette", image: "/images/ingredients/roquette.svg" },
        { name: "Jambon de Parme", image: "/images/ingredients/jambon-parme.svg" }
      ],
      image: "/images/pizzas/ludmilove.jpg"
    },
    "16": {
      id: "16",
      name: "La Truffe",
      price: "20.00€",
      description: "Une pizza luxueuse avec jambon truffé et ricotta de buffala.",
      histoire: "L'apothéose du raffinement, une pizza pour les grandes occasions.",
      ingredients: [
        { name: "Crème fraîche", image: "/images/ingredients/creme.svg" },
        { name: "Mozzarella fior di latte", image: "/images/ingredients/mozzarella.svg" },
        { name: "Jambon truffé", image: "/images/ingredients/jambon-truffe.svg" },
        { name: "Ricotta di buffala", image: "/images/ingredients/ricotta-buffala.svg" },
        { name: "Copeaux de truffe", image: "/images/ingredients/truffe.svg" }
      ],
      image: "/images/pizzas/truffe.jpg"
    }
  };

  const pizza = pizzaDetails[pizzaId];
  const pizzaAllergens = getPizzaAllergens(pizzaId);

  if (!pizza) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Pizza non trouvée</p>
          <Button onClick={() => onNavigate('menu')} className="mt-4">
            Retour au menu
          </Button>
        </div>
      </div>
    );
  }

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
            <span className="text-3xl font-bold text-primary">{pizza.price}</span>
          </div>

          {/* Photo de la pizza */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="relative h-96 bg-gradient-to-br from-gray-50 to-gray-100">
              {pizza.image ? (
                <img 
                  src={pizza.image} 
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
            <p className="text-gray-700 text-lg leading-relaxed">{pizza.histoire}</p>
          </div>

          {/* Ingrédients */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Ingrédients</h2>
            <div className="space-y-3">
              {pizza.ingredients.map((ingredient, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {ingredient.image ? (
                      <img 
                        src={ingredient.image} 
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

