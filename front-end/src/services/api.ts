import { useState, useEffect } from 'react';
import { PIZZERIA_MENU } from '../data/pizzeria-menu';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const REQUEST_TIMEOUT_MS = 6000;
const MAX_RETRIES = 1;
console.log('🌐 API_BASE_URL configuré:', API_BASE_URL);
console.log('🔧 VITE_API_URL env variable:', import.meta.env.VITE_API_URL);

// Types pour la pizzeria
export interface Ingredient {
  id: number;
  name: string;
  allergen: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pizza {
  id: number;
  name: string;
  description?: string;
  price: string;
  size: string;
  available: boolean;
  vegetarian: boolean;
  imageUrl?: string | null;
  preparationTime: number;
  ingredients: Ingredient[];
  createdAt: string;
  updatedAt: string;
}

export interface Dessert {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Boisson {
  id: number;
  name: string;
  description: string;
  price: string;
  category: 'SODAS' | 'JUS' | 'VINS' | 'BIERES' | 'APERITIFS' | 'DIGESTIFS' | 'AUTRES';
  available: boolean;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

function normalizePrice(rawPrice: string): string {
  return rawPrice.replace('EUR', '').replace('€', '').replace(',', '.').trim();
}

function buildFallbackPizzas(): Pizza[] {
  const now = new Date().toISOString();
  return PIZZERIA_MENU.map((item, index) => ({
    id: index + 1,
    name: item.name,
    description: item.desc,
    price: normalizePrice(item.price),
    size: 'M',
    available: true,
    vegetarian: /vegetariana|quattro formaggi|margherita/i.test(item.name),
    imageUrl: null,
    preparationTime: 15,
    ingredients: [],
    createdAt: now,
    updatedAt: now,
  }));
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

// Helper function with retry logic
async function fetchWithRetry(url: string, retries = MAX_RETRIES, initialDelay = 1200): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 Tentative ${i + 1}/${retries} pour: ${url}`);
      const response = await fetchWithTimeout(url, REQUEST_TIMEOUT_MS);
      
      if (response.ok) {
        console.log(`✅ Succès après ${i + 1} tentative(s)`);
        console.log(`📡 Response status: ${response.status} ${response.statusText}`);
        console.log(`📋 Response headers:`, Object.fromEntries(response.headers.entries()));
        return response;
      }
      
      if (i === retries - 1) return response;
      
      const delay = initialDelay * Math.pow(2, i);
      console.log(`⏳ Attente de ${delay}ms avant nouvelle tentative...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
    } catch (error) {
      console.error(`💥 Erreur tentative ${i + 1}:`, error);

      if (i === retries - 1) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          throw new Error('Serveur indisponible (timeout). Reessayez dans quelques secondes.');
        }
        throw error;
      }
      
      const delay = initialDelay * Math.pow(2, i);
      console.log(`⏳ Attente de ${delay}ms avant nouvelle tentative...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries reached');
}

// Pizzas API
export const pizzasAPI = {
  async getAll(): Promise<Pizza[]> {
    console.log(`🍕 Fetching all pizzas from: ${API_BASE_URL}/pizzas`);
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/pizzas`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Error response body:`, errorText);
        throw new Error(`Failed to fetch pizzas: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ Successfully fetched ${data.length} pizzas`);
      return data;
    } catch (error) {
      console.error('💥 Fetch error:', error);
      console.warn('⚠️ Backend indisponible, utilisation des pizzas locales en secours');
      return buildFallbackPizzas();
    }
  },

  async getById(id: number): Promise<Pizza> {
    const response = await fetch(`${API_BASE_URL}/pizzas/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch pizza');
    }
    return response.json();
  }
};

// Alias pour compatibilité
export const pizzaService = pizzasAPI;

// Desserts API
export const dessertsAPI = {
  async getAll(): Promise<Dessert[]> {
    const response = await fetchWithRetry(`${API_BASE_URL}/desserts`);
    if (!response.ok) {
      throw new Error('Failed to fetch desserts');
    }
    return response.json();
  }
};

// Boissons API
export const boissonsAPI = {
  async getAll(): Promise<Boisson[]> {
    const response = await fetchWithRetry(`${API_BASE_URL}/boissons`);
    if (!response.ok) {
      throw new Error('Failed to fetch boissons');
    }
    return response.json();
  },

  async getByCategory(category: string): Promise<Boisson[]> {
    const response = await fetch(`${API_BASE_URL}/boissons/category/${category}`);
    if (!response.ok) {
      throw new Error('Failed to fetch boissons by category');
    }
    return response.json();
  }
};

// React hooks
export function usePizzas() {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPizzas() {
      try {
        setLoading(true);
        const data = await pizzasAPI.getAll();
        setPizzas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchPizzas();
  }, []);

  return { pizzas, loading, error };
}

export function useDesserts() {
  const [desserts, setDesserts] = useState<Dessert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDesserts() {
      try {
        setLoading(true);
        const data = await dessertsAPI.getAll();
        setDesserts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchDesserts();
  }, []);

  return { desserts, loading, error };
}

export function useBoissons() {
  const [boissons, setBoissons] = useState<Boisson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBoissons() {
      try {
        setLoading(true);
        const data = await boissonsAPI.getAll();
        setBoissons(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchBoissons();
  }, []);

  return { boissons, loading, error };
}
