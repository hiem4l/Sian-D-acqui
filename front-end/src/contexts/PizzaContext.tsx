import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { pizzasAPI } from '../services/api';
import type { Pizza } from '../services/api';

interface PizzaContextType {
  pizzas: Pizza[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const PizzaContext = createContext<PizzaContextType | undefined>(undefined);

export function PizzaProvider({ children }: { children: ReactNode }) {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPizzas = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🚀 PizzaContext: Préchargement des pizzas...');
      const data = await pizzasAPI.getAll();
      setPizzas(data);
      console.log(`✅ PizzaContext: ${data.length} pizzas préchargées`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des pizzas';
      setError(errorMessage);
      console.error('❌ PizzaContext: Erreur de préchargement', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  return (
    <PizzaContext.Provider value={{ pizzas, loading, error, refetch: fetchPizzas }}>
      {children}
    </PizzaContext.Provider>
  );
}

export function usePizzaContext() {
  const context = useContext(PizzaContext);
  if (context === undefined) {
    throw new Error('usePizzaContext must be used within a PizzaProvider');
  }
  return context;
}
