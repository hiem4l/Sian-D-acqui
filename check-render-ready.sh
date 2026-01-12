#!/bin/bash
# Script de vérification avant migration Render

echo "🔍 Vérification de la configuration..."

# Vérifier que les fichiers nécessaires existent
if [ -f "render.yaml" ]; then
  echo "✅ render.yaml trouvé"
else
  echo "❌ render.yaml manquant"
  exit 1
fi

if [ -f "sian-dacqui-backend/package.json" ]; then
  echo "✅ package.json trouvé"
else
  echo "❌ package.json manquant"
  exit 1
fi

# Vérifier les scripts npm
cd sian-dacqui-backend
if grep -q "start:prod" package.json; then
  echo "✅ Script start:prod trouvé"
else
  echo "❌ Script start:prod manquant"
  exit 1
fi

echo ""
echo "🎉 Tout est prêt pour la migration!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Va sur https://render.com et crée un compte"
echo "2. Suis le guide MIGRATION-RENDER.md"
echo "3. Ou utilise le Blueprint avec render.yaml"
echo ""
