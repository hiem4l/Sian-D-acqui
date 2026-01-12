# 🚀 Migration vers Render.com (100% GRATUIT)

## ⚡ Guide Complet de Migration depuis Railway

### 📋 Étape 1: Créer un compte Render

1. Va sur https://render.com
2. Clique "Get Started for Free"
3. Connecte-toi avec ton compte GitHub (recommandé)
4. Autorise Render à accéder à tes repos

---

### 🗄️ Étape 2: Créer la Base de Données PostgreSQL

1. **Dans le Dashboard Render:**
   - Clique sur "New +" en haut à droite
   - Sélectionne "PostgreSQL"

2. **Configuration:**
   ```
   Name: sian-dacqui-db
   Database: sian_dacqui
   User: sian_user
   Region: Frankfurt (Europe - le plus proche)
   Plan: Free
   ```

3. **Créer la DB:**
   - Clique "Create Database"
   - ⏳ Attends 2-3 minutes que la DB soit créée
   - ✅ Note l'URL "Internal Database URL" (on en aura besoin)

---

### 🔧 Étape 3: Déployer le Backend

1. **Créer le Service Web:**
   - Dashboard → "New +" → "Web Service"
   - Sélectionne le repo `MrKiwistiti/Sian-D-acqui`
   - Connecte GitHub si besoin

2. **Configuration de Base:**
   ```
   Name: sian-dacqui-backend
   Region: Frankfurt
   Branch: main
   Root Directory: sian-dacqui-backend
   Runtime: Node
   Plan: Free
   ```

3. **Build & Start Commands:**
   ```
   Build Command:
   npm install && npm run build

   Start Command:
   npm run start:prod
   ```

4. **Variables d'Environnement:**
   
   Clique sur "Environment" → "Add Environment Variable"
   
   Ajoute ces variables:
   
   ```
   NODE_ENV = production
   PORT = 3001
   DB_SYNCHRONIZE = true
   JWT_SECRET = [Clique "Generate" pour créer une valeur aléatoire]
   ```

   **Pour DATABASE_URL:**
   - Copie l'URL de ta DB depuis l'étape 2
   - Format: `postgresql://user:password@host:port/database`

5. **Health Check:**
   ```
   Health Check Path: /api/pizzas
   ```

6. **Créer le Service:**
   - Clique "Create Web Service"
   - ⏳ Le déploiement prend 3-5 minutes

---

### 🌐 Étape 4: Mettre à Jour le Frontend (Netlify)

1. **Récupérer l'URL du Backend:**
   - Sur Render, ton backend aura une URL comme:
   - `https://sian-dacqui-backend.onrender.com`

2. **Mettre à Jour Netlify:**
   - Va sur https://app.netlify.com
   - Sélectionne ton site "siandacqui"
   - "Site configuration" → "Environment variables"
   
3. **Modifier la variable:**
   ```
   VITE_API_URL = https://sian-dacqui-backend.onrender.com/api
   ```
   (Remplace par ton URL Render)

4. **Redéployer:**
   - Netlify → "Deploys" → "Trigger deploy" → "Deploy site"

---

### 📊 Étape 5: Insérer les Données

1. **Ouvrir la Console SQL Render:**
   - Dashboard Render → Ta base de données
   - Onglet "Query" ou "Shell"

2. **Exécuter le Script SQL:**
   - Copie le contenu de `sian-dacqui-backend/seed-desserts-boissons.sql`
   - Colle dans la console Render
   - Exécute

3. **Vérifier que les pizzas existent:**
   ```sql
   SELECT COUNT(*) FROM pizzas;
   SELECT COUNT(*) FROM desserts;
   SELECT COUNT(*) FROM boissons;
   ```

---

### ✅ Étape 6: Vérification

1. **Tester le Backend:**
   ```bash
   curl https://[TON-URL-RENDER].onrender.com/api/pizzas
   ```
   
   Tu devrais voir les 16 pizzas en JSON

2. **Tester le Frontend:**
   - Va sur https://siandacqui.netlify.app
   - Clique sur "Voir la carte"
   - Les pizzas devraient charger (peut prendre 15-30s la première fois)

3. **Vérifier les logs:**
   - Render Dashboard → Ton service → "Logs"
   - Vérifie qu'il n'y a pas d'erreurs

---

### 🔄 Migration Automatique (Alternative)

Si tu as pushé le fichier `render.yaml` sur GitHub:

1. Render Dashboard → "New +" → "Blueprint"
2. Sélectionne ton repo
3. Render détectera automatiquement `render.yaml`
4. Tout sera créé automatiquement!

---

## 📝 Différences Railway vs Render

| Fonctionnalité | Railway | Render |
|----------------|---------|--------|
| **Prix** | $5-10/mois | **GRATUIT** ✅ |
| **Base de données** | PostgreSQL ($5) | **PostgreSQL gratuit** ✅ |
| **Démarrage** | Rapide | 15-30s si inactif |
| **Limite** | Crédit épuisable | Permanent |
| **Auto-deploy** | Oui | Oui |

---

## ⚠️ Important à Savoir

### Cold Start (Premier chargement)
- Si personne ne visite ton site pendant 15 min, Render met le service en veille
- Le prochain visiteur attendra 15-30 secondes
- **Solution:** Le système de retry que j'ai créé gère ça automatiquement!

### Limitations du Plan Gratuit
- 750 heures/mois (largement suffisant)
- Service se met en veille après 15 min d'inactivité
- Bande passante limitée (mais suffisante pour un petit site)

### Quand Upgrader?
- Quand tu as beaucoup de visiteurs (>1000/jour)
- Si tu veux éviter le "cold start"
- Render Starter Plan: $7/mois (service toujours actif)

---

## 🆘 Dépannage

### Le backend ne démarre pas?
1. Vérifie les logs: Dashboard → Service → Logs
2. Vérifie que `DATABASE_URL` est bien configurée
3. Vérifie que le build s'est bien passé

### Les pizzas ne chargent pas?
1. Vérifie l'URL dans Netlify (doit finir par `/api`)
2. Teste l'URL directement dans le navigateur
3. Attends 30s (cold start possible)

### La DB est vide?
1. Vérifie que `DB_SYNCHRONIZE=true` (crée les tables auto)
2. Exécute le script SQL manuellement
3. Redémarre le service Render

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Discord Render**: https://discord.gg/render
- **Status**: https://status.render.com

---

**Temps estimé total:** 15-20 minutes
**Coût:** 0€ (100% gratuit pour toujours!)

✨ Une fois migré, ton site sera **complètement gratuit** et fonctionnel!
