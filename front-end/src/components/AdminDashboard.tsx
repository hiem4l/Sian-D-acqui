import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Pizza, IceCream, Wine } from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface AdminDashboardProps {
  user?: AdminUser;
  onLogout?: () => void;
  onNavigate: (page: string) => void;
}

interface Stats {
  pizzas: number;
  ingredients: number;
  desserts: number;
  boissons: number;
}

export function AdminDashboard({ user, onLogout, onNavigate }: AdminDashboardProps) {
  const [stats, setStats] = useState<Stats>({ pizzas: 0, ingredients: 0, desserts: 0, boissons: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      
      const [pizzasRes, ingredientsRes, dessertsRes, boissonsRes] = await Promise.all([
        fetch(`${API_BASE}/pizzas`),
        fetch(`${API_BASE}/ingredients`),
        fetch(`${API_BASE}/desserts`),
        fetch(`${API_BASE}/boissons`)
      ]);

      const [pizzas, ingredients, desserts, boissons] = await Promise.all([
        pizzasRes.json(),
        ingredientsRes.json(),
        dessertsRes.json(),
        boissonsRes.json()
      ]);

      setStats({
        pizzas: pizzas.length,
        ingredients: ingredients.length,
        desserts: desserts.length,
        boissons: boissons.length
      });
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Si on a un utilisateur admin connecté, afficher le dashboard complet
  if (user && onLogout) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
                <span className="text-sm text-gray-500">Pizzeria Sian D'Acqui</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <img 
                    src={user.picture} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => onNavigate('home')}
                  className="hidden sm:inline-flex"
                >
                  Voir le site
                </Button>
                
                <Button 
                  variant="ghost" 
                  onClick={onLogout}
                  className="text-red-600 hover:text-red-700"
                >
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Pizza className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pizzas</p>
                  <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.pizzas}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-xl">🥕</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ingrédients</p>
                  <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.ingredients}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <IceCream className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Desserts</p>
                  <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.desserts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Wine className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Boissons</p>
                  <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.boissons}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Cards */}
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
                <Button className="mt-4" onClick={() => onNavigate('pizzaManager')}>
                  Gérer les pizzas
                </Button>
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
                <Button className="mt-4" onClick={() => alert('Fonctionnalité en développement')}>
                  Gérer les desserts
                </Button>
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
                <Button className="mt-4" onClick={() => alert('Fonctionnalité en développement')}>
                  Gérer les boissons
                </Button>
              </CardContent>
            </Card>
          </div>

        </main>
      </div>
    );
  }

  // Fallback pour l'ancien dashboard (si pas d'utilisateur connecté)
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
