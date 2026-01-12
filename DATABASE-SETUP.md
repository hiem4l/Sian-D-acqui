# 🍕 Sian D'Acqui - Guide de Déploiement Base de Données

## 📊 État Actuel

### ✅ Fonctionnel
- **Pizzas**: 16 pizzas chargées et affichées
- **Backend API**: Opérationnel sur Railway
- **Frontend**: Déployé sur Netlify

### ⚠️ À Configurer
- **Desserts**: Tables créées mais données non insérées
- **Boissons**: Tables créées mais données non insérées

---

## 🔧 Procédure d'Insertion des Données

### Option 1: Via Railway Dashboard (Recommandé)

1. **Aller sur Railway**
   - Ouvrir https://railway.app
   - Sélectionner le projet `sian-d-acqui-production`
   - Cliquer sur le service **PostgreSQL**

2. **Ouvrir la Console SQL**
   - Onglet "Data" → "Query"
   - Ou utiliser "Connect" → copier la connection string

3. **Exécuter le Script**
   - Copier le contenu de `seed-desserts-boissons.sql`
   - Le coller dans la console SQL
   - Exécuter

### Option 2: Via psql en local

```bash
# Récupérer l'URL de la DB depuis Railway
DATABASE_URL="postgresql://..."

# Exécuter le script
psql $DATABASE_URL -f sian-dacqui-backend/seed-desserts-boissons.sql
```

### Option 3: Via Neon Dashboard

1. Aller sur https://console.neon.tech
2. Sélectionner votre projet
3. SQL Editor → Coller le script → Run

---

## 📋 Données à Insérer

### Desserts (1 élément)
- La Nutella - 7€

### Boissons (7 éléments)

**SODAS (4)**
- Coca-Cola - 3€
- Coca-Cola Zéro - 3€  
- Orangina - 3€
- Ice Tea Pêche - 3€

**BIERE (1)**
- Heineken 33cl - 3€

**VINS (2)**
- Marrenon Pinot noir (Rouge) - 17€
- Sun Up Pinot noir (Rosé) - 17€

---

## 🔍 Vérification Post-Insertion

```bash
# Vérifier les desserts
curl https://sian-d-acqui-production.up.railway.app/api/desserts

# Vérifier les boissons
curl https://sian-d-acqui-production.up.railway.app/api/boissons

# Vérifier par catégorie
curl https://sian-d-acqui-production.up.railway.app/api/boissons?category=SODAS
curl https://sian-d-acqui-production.up.railway.app/api/boissons?category=VINS
```

---

## 💡 Notes Importantes

### Performance de la DB

**Réponse:** Ta DB gratuite Neon est largement suffisante!

- ✅ **Les pizzas chargent bien** (preuve que la DB fonctionne)
- ✅ **Le problème était TypeScript**, pas la DB
- ✅ **Neon offre**:
  - 512 MB de stockage (tu utilises ~1 MB)
  - 100 heures de compute par mois
  - 3 GB de transfert

**Tu n'as PAS besoin de payer pour une DB!** 🎉

Le problème de chargement venait de:
1. Erreurs TypeScript dans les nouveaux services (corrigé ✅)
2. Les tables desserts/boissons non créées (à faire)

### Migrations Automatiques

Si `synchronize: true` est activé en développement, TypeORM créera automatiquement les tables au démarrage du backend.

⚠️ **En production**, il faut:
- Soit activer temporairement `synchronize: true`
- Soit exécuter manuellement le SQL
- Soit utiliser les migrations TypeORM

---

## 🚀 Prochaines Étapes

1. ✅ **Backend corrigé** - Les erreurs TypeScript sont résolues
2. ⏳ **Insertion données** - Exécuter `seed-desserts-boissons.sql`
3. 📱 **Frontend** - Créer les hooks `useDesserts()` et `useBoissons()`
4. 🎨 **Affichage** - Connecter MenuPage aux vraies données
5. 👨‍💼 **Admin Panel** - Interface pour gérer pizzas/desserts/boissons

---

## 📞 Support

Si problème persistant:
- Vérifier les logs Railway
- Vérifier la connexion DB dans Railway
- S'assurer que `DATABASE_URL` est définie

---

**Créé le:** 12 janvier 2026
**Status:** Backend opérationnel, données à insérer
