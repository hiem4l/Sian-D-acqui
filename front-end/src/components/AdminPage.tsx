import { useState } from 'react';
import { AdminAuth } from './AdminAuth';
import { AdminDashboard } from './AdminDashboard';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

export function AdminPage({ onNavigate }: AdminPageProps) {
  const [user, setUser] = useState<AdminUser | null>(() => {
    // Vérifier si on a une session admin stockée
    const storedAdmin = localStorage.getItem('admin-user');
    if (storedAdmin) {
      try {
        return JSON.parse(storedAdmin);
      } catch (e) {
        localStorage.removeItem('admin-user');
        return null;
      }
    }
    return null;
  });

  const handleAuthSuccess = (adminUser: AdminUser) => {
    setUser(adminUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-user');
    setUser(null);
  };

  // Si pas d'utilisateur connecté, afficher l'écran de login
  if (!user) {
    return (
      <AdminAuth 
        onAuthSuccess={handleAuthSuccess}
        onNavigate={onNavigate}
      />
    );
  }

  // Sinon afficher le dashboard
  return (
    <AdminDashboard 
      user={user}
      onLogout={handleLogout}
      onNavigate={onNavigate}
    />
  );
}