-- Insertion des desserts
INSERT INTO desserts (name, description, price, available, "imageUrl", "createdAt", "updatedAt")
VALUES 
  ('Pizza Nutella', 'Pizza sucrée avec Nutella et noisettes', 7.00, true, null, NOW(), NOW()),
  ('Tiramisu', 'Le classique italien au café et mascarpone', 6.50, true, null, NOW(), NOW()),
  ('Panna Cotta', 'Crème italienne avec coulis de fruits rouges', 6.00, true, null, NOW(), NOW()),
  ('Cannoli Siciliens', 'Tubes croustillants garnis de ricotta sucrée', 5.50, true, null, NOW(), NOW());

-- Insertion des boissons
INSERT INTO boissons (name, description, price, available, size, "imageUrl", "createdAt", "updatedAt")
VALUES 
  ('Eau minérale', 'Eau plate ou gazeuse', 2.50, true, '50cl', null, NOW(), NOW()),
  ('Coca-Cola', 'Boisson gazeuse', 3.00, true, '33cl', null, NOW(), NOW()),
  ('Coca-Cola Zero', 'Boisson gazeuse sans sucre', 3.00, true, '33cl', null, NOW(), NOW()),
  ('Orangina', 'Boisson gazeuse à l''orange', 3.00, true, '33cl', null, NOW(), NOW()),
  ('Limonade artisanale', 'Limonade maison', 3.50, true, '33cl', null, NOW(), NOW()),
  ('Jus d''orange', 'Jus d''orange pressé', 4.00, true, '25cl', null, NOW(), NOW()),
  ('Vin rouge', 'Vin rouge italien', 4.50, true, '12cl', null, NOW(), NOW()),
  ('Vin blanc', 'Vin blanc italien', 4.50, true, '12cl', null, NOW(), NOW()),
  ('Vin rosé', 'Vin rosé de Provence', 4.50, true, '12cl', null, NOW(), NOW()),
  ('Bière artisanale', 'Bière locale', 5.00, true, '33cl', null, NOW(), NOW()),
  ('Peroni', 'Bière italienne', 4.50, true, '33cl', null, NOW(), NOW()),
  ('Café expresso', 'Café italien', 2.00, true, null, null, NOW(), NOW()),
  ('Cappuccino', 'Café avec mousse de lait', 3.50, true, null, null, NOW(), NOW());
