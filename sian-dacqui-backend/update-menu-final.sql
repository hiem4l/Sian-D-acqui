-- Reset pizzas to match exact menu
DELETE FROM pizza;

-- Traditionnelles (11 pizzas)
INSERT INTO pizza (name, description, price, category, image_url, allergens, is_vegetarian, available) VALUES
('La Marguerite', 'Sauce tomate maison, mozzarella, basilic, huile d''olive', 10.00, 'Traditionnelle', '/images/pizzas/margherita.jpg', ARRAY['gluten', 'lait'], true, true),
('La Regina', 'Sauce tomate maison, mozzarella, jambon, champignons', 13.00, 'Traditionnelle', '/images/pizzas/regina.jpg', ARRAY['gluten', 'lait'], false, true),
('La Napolitaine', 'Sauce tomate maison, mozzarella, anchois, câpres, olives noires', 13.00, 'Traditionnelle', '/images/pizzas/napolitaine.jpg', ARRAY['gluten', 'lait', 'poisson'], false, true),
('La Caprese', 'Sauce tomate maison, mozzarella, tomates fraîches, basilic, huile d''olive', 13.00, 'Traditionnelle', '/images/pizzas/caprese.jpg', ARRAY['gluten', 'lait'], true, true),
('La Quatre Saisons', 'Sauce tomate maison, mozzarella, jambon, champignons, artichauts, olives', 14.00, 'Traditionnelle', '/images/pizzas/quatre-saisons.jpg', ARRAY['gluten', 'lait'], false, true),
('La Chèvre Miel', 'Sauce tomate maison, mozzarella, fromage de chèvre, miel, noix', 14.00, 'Traditionnelle', '/images/pizzas/chevre-miel.jpg', ARRAY['gluten', 'lait', 'fruits à coque'], true, true),
('La Quatre Fromages', 'Sauce tomate maison, mozzarella, gorgonzola, parmesan, chèvre', 14.00, 'Traditionnelle', '/images/pizzas/quatre-fromages.jpg', ARRAY['gluten', 'lait'], true, true),
('La Calabrese', 'Sauce tomate maison, mozzarella, salami piquant, poivrons, olives', 14.00, 'Traditionnelle', '/images/pizzas/calabrese.jpg', ARRAY['gluten', 'lait'], false, true),
('La Calzone', 'Sauce tomate maison, mozzarella, jambon, champignons, œuf (pizza fermée)', 14.00, 'Traditionnelle', '/images/pizzas/calzone.jpg', ARRAY['gluten', 'lait', 'œufs'], false, true),
('La Merguez', 'Sauce tomate maison, mozzarella, merguez, poivrons, oignons', 14.00, 'Traditionnelle', '/images/pizzas/merguez.jpg', ARRAY['gluten', 'lait'], false, true),
('La Cannibale', 'Sauce tomate maison, mozzarella, jambon, merguez, bœuf haché, chorizo', 15.00, 'Traditionnelle', '/images/pizzas/cannibale.jpg', ARRAY['gluten', 'lait'], false, true);

-- Signatures (5 pizzas)
INSERT INTO pizza (name, description, price, category, image_url, allergens, is_vegetarian, available) VALUES
('La Lily-Rose', 'Sauce tomate maison, mozzarella, jambon de Parme, roquette, parmesan, tomates cerises', 15.00, 'Signature', '/images/pizzas/lily-rose.jpg', ARRAY['gluten', 'lait'], false, true),
('La Emmy-Lou', 'Crème fraîche, mozzarella, saumon fumé, aneth, citron, oignons rouges', 15.00, 'Signature', '/images/pizzas/emmy-lou.jpg', ARRAY['gluten', 'lait', 'poisson'], false, true),
('La Chris', 'Sauce tomate maison, aubergine, courgettes, basilic, parmesan, jambon cru après cuisson', 15.00, 'Signature', '/images/pizzas/chris.jpg', ARRAY['gluten', 'lait'], false, true),
('La Ludmilove', 'Crème fraîche, mozzarella, gorgonzola, noix, miel, poire', 15.00, 'Signature', '/images/pizzas/ludmilove.jpg', ARRAY['gluten', 'lait', 'fruits à coque'], true, true),
('La Truffe', 'Crème de truffe, mozzarella, champignons, jambon de Parme, parmesan, huile de truffe', 18.00, 'Signature', '/images/pizzas/truffe.jpg', ARRAY['gluten', 'lait'], false, true);
