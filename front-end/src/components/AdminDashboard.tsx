import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Pizza, IceCream, Wine } from "lucide-react";

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-orange-900 mb-8">
          Tableau de bord Admin
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Pizza className="w-12 h-12 text-orange-600 mb-2" />
              <CardTitle>Pizzas</CardTitle>
              <CardDescription>Gérer les pizzas du menu</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ajouter, modifier ou supprimer des pizzas
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <IceCream className="w-12 h-12 text-orange-600 mb-2" />
              <CardTitle>Desserts</CardTitle>
              <CardDescription>Gérer les desserts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ajouter, modifier ou supprimer des desserts
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Wine className="w-12 h-12 text-orange-600 mb-2" />
              <CardTitle>Boissons</CardTitle>
              <CardDescription>Gérer les boissons</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ajouter, modifier ou supprimer des boissons
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <button
            onClick={() => onNavigate("home")}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
