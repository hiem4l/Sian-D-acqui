-- ===============================================
-- SEED DATA FOR DESSERTS & BOISSONS
-- Sian D'Acqui Pizzeria Menu
-- ===============================================

-- Insertion des desserts
INSERT INTO desserts (name, description, price, available, "imageUrl", "displayOrder", "createdAt", "updatedAt")
VALUES 
  ('La Nutella', 'Pizza sucrée garnie de Nutella', 7.00, true, null, 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insertion des boissons - SODAS
INSERT INTO boissons (name, description, price, available, size, category, "imageUrl", "displayOrder", "createdAt", "updatedAt")
VALUES 
  ('Coca-Cola', 'Coca-Cola classique', 3.00, true, '33cl', 'SODAS', null, 1, NOW(), NOW()),
  ('Coca-Cola Zéro', 'Coca-Cola sans sucre', 3.00, true, '33cl', 'SODAS', null, 2, NOW(), NOW()),
  ('Orangina', 'Boisson gazeuse à l''orange', 3.00, true, '33cl', 'SODAS', null, 3, NOW(), NOW()),
  ('Ice Tea Pêche', 'Thé glacé saveur pêche', 3.00, true, '33cl', 'SODAS', null, 4, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insertion des boissons - BIERE
INSERT INTO boissons (name, description, price, available, size, category, "imageUrl", "displayOrder", "createdAt", "updatedAt")
VALUES 
  ('Heineken', 'Bière blonde hollandaise', 3.00, true, '33cl', 'BIERE', null, 10, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insertion des boissons - VINS
INSERT INTO boissons (name, description, price, available, size, category, "imageUrl", "displayOrder", "createdAt", "updatedAt")
VALUES 
  ('Marrenon, Les Grains, Pinot noir', 'IGP Méditerranée (Rouge)', 17.00, true, null, 'VINS', null, 20, NOW(), NOW()),
  ('Sun Up, Les Grains, Pinot noir', 'IGP Méditerranée (Rosé)', 17.00, true, null, 'VINS', null, 21, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Afficher le résultat
SELECT 'Desserts insérés:' as info, COUNT(*) as count FROM desserts;
SELECT 'Boissons insérées:' as info, COUNT(*) as count FROM boissons;
SELECT 'Boissons par catégorie:' as info, category, COUNT(*) as count FROM boissons GROUP BY category ORDER BY category;

