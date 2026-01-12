import { Controller, Post } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('admin')
export class AdminController {
  constructor(private readonly dataSource: DataSource) {}

  @Post('init-db')
  async initDatabase() {
    try {
      const sql = `
-- Create tables for pizzeria app
CREATE TABLE IF NOT EXISTS pizzas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    size VARCHAR(50) DEFAULT 'medium',
    available BOOLEAN DEFAULT true,
    "imageUrl" VARCHAR(500),
    "preparationTime" INTEGER DEFAULT 0,
    vegetarian BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    allergen BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pizza_ingredients (
    pizza_id INTEGER NOT NULL REFERENCES pizzas(id) ON DELETE CASCADE,
    ingredient_id INTEGER NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    PRIMARY KEY (pizza_id, ingredient_id)
);

-- Insert pizzas
INSERT INTO pizzas (id, name, description, price, vegetarian, available, "preparationTime") VALUES
(1, 'La Marguerite', 'La pizza classique italienne par excellence', 10.00, true, true, 12),
(2, 'La Regina', 'Une pizza généreuse et savoureuse', 13.00, false, true, 15),
(3, 'La Napo', 'L''authentique pizza napolitaine', 14.00, false, true, 15),
(4, 'La Calabrese', 'Pizza épicée aux saveurs du sud', 14.00, false, true, 15),
(5, 'La 4 Fromages', 'Pour les amateurs de fromage', 13.50, true, true, 14),
(6, 'La Salmone', 'Pizza raffinée au saumon', 15.50, false, true, 16),
(7, 'La Vegetariana', 'Un festival de légumes frais', 13.00, true, true, 14),
(8, 'La Campagnola', 'Pizza rustique et généreuse', 14.50, false, true, 16),
(9, 'La Marinara', 'La plus simple et authentique', 9.00, true, true, 10),
(10, 'La Calzone', 'Pizza fermée garnie', 14.00, false, true, 18),
(11, 'La Diavola', 'Pizza piquante pour les audacieux', 13.50, false, true, 15),
(12, 'La Capricciosa', 'Pizza aux multiples saveurs', 14.50, false, true, 16),
(13, 'La Prosciutto e Funghi', 'Jambon et champignons', 13.50, false, true, 15),
(14, 'La Tonno', 'Pizza au thon', 13.00, false, true, 14),
(15, 'La Parmigiana', 'Aux aubergines et parmesan', 13.50, true, true, 15),
(16, 'La Siciliana', 'Saveurs de Sicile', 14.00, false, true, 15)
ON CONFLICT (name) DO NOTHING;

-- Reset sequence
SELECT setval('pizzas_id_seq', (SELECT MAX(id) FROM pizzas));

-- Insert sample ingredients
INSERT INTO ingredients (name, allergen) VALUES
('Sauce tomate', false),
('Mozzarella', true),
('Basilic', false),
('Jambon', false),
('Champignons', false),
('Anchois', true),
('Salami piquant', false),
('Gorgonzola', true),
('Saumon fumé', true),
('Légumes grillés', false),
('Œuf', true),
('Olives', false),
('Ail', false),
('Thon', true),
('Aubergines', false),
('Parmesan', true)
ON CONFLICT (name) DO NOTHING;

-- Link pizzas with ingredients (examples)
INSERT INTO pizza_ingredients (pizza_id, ingredient_id) 
SELECT 1, id FROM ingredients WHERE name IN ('Sauce tomate', 'Mozzarella', 'Basilic')
ON CONFLICT DO NOTHING;

INSERT INTO pizza_ingredients (pizza_id, ingredient_id)
SELECT 2, id FROM ingredients WHERE name IN ('Sauce tomate', 'Mozzarella', 'Jambon', 'Champignons')
ON CONFLICT DO NOTHING;
      `;
      
      await this.dataSource.query(sql);
      
      return {
        success: true,
        message: 'Database initialized successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post('update-real-pizzas')
  async updateRealPizzas() {
    try {
      const sql = `
-- Suppression des anciennes pizzas
TRUNCATE TABLE pizza_ingredients CASCADE;
TRUNCATE TABLE pizzas CASCADE;
TRUNCATE TABLE ingredients CASCADE;

-- Réinitialisation des séquences
ALTER SEQUENCE pizzas_id_seq RESTART WITH 1;
ALTER SEQUENCE ingredients_id_seq RESTART WITH 1;

-- Insertion des vraies pizzas (sans images pour l'instant)
INSERT INTO pizzas (id, name, description, price, size, available, "imageUrl", "preparationTime", vegetarian, "createdAt", "updatedAt") VALUES
(1, 'La Marguerite', 'La pizza classique italienne par excellence, simple et authentique.', 10.00, 'medium', true, null, 12, true, NOW(), NOW()),
(2, 'La Regina', 'Une pizza généreuse et savoureuse, parfaite pour les amateurs de classiques.', 13.00, 'medium', true, null, 15, false, NOW(), NOW()),
(3, 'La Napo', 'L''authentique pizza napolitaine, simple mais savoureuse avec ses anchois fins.', 14.00, 'medium', true, null, 15, false, NOW(), NOW()),
(4, 'La Caprese', 'Une variation caprese avec anchois et câpres.', 14.00, 'medium', true, null, 15, false, NOW(), NOW()),
(5, 'La 4 Saisons', 'Une pizza classique avec quatre saisons de saveurs différentes.', 14.00, 'medium', true, null, 16, false, NOW(), NOW()),
(6, 'La Chevre Miel', 'Une pizza gourmande avec chèvre, miel et crème de balsamique.', 14.00, 'medium', true, null, 14, true, NOW(), NOW()),
(7, 'La Calabrese', 'Une pizza épicée avec spianata et guanciale.', 15.00, 'medium', true, null, 15, false, NOW(), NOW()),
(8, 'La Calzone', 'Un calzone traditionnel avec œuf et jambon.', 14.00, 'medium', true, null, 18, false, NOW(), NOW()),
(9, 'La 4 Fromages', 'Une pizza riche et savoureuse avec quatre fromages différents.', 14.00, 'medium', true, null, 14, true, NOW(), NOW()),
(10, 'La Merguez', 'Une pizza savoureuse avec merguez du boucher et olives.', 14.00, 'medium', true, null, 15, false, NOW(), NOW()),
(11, 'La Cannibale', 'Une pizza généreuse avec viande hachée Angus, poivrons et sauce chimichuri.', 15.00, 'medium', true, null, 16, false, NOW(), NOW()),
(12, 'La Lily-Rose', 'Une pizza raffinée avec burrata, mortadelle et finitions fraîches.', 15.00, 'medium', true, null, 16, false, NOW(), NOW()),
(13, 'La Emmy-Lou', 'Une pizza légère avec courgettes, ricotta et pistou.', 15.00, 'medium', true, null, 15, true, NOW(), NOW()),
(14, 'La Chris', 'Une pizza végétale avec aubergines, courgettes et jambon cru en finition.', 15.00, 'medium', true, null, 16, false, NOW(), NOW()),
(15, 'La Ludmilove', 'Une pizza raffinée avec roquette et jambon de Parme.', 15.00, 'medium', true, null, 15, false, NOW(), NOW()),
(16, 'La Truffe', 'Une pizza luxueuse avec jambon truffé et ricotta de buffala.', 20.00, 'medium', true, null, 18, false, NOW(), NOW());

-- Insertion de quelques ingrédients de base
INSERT INTO ingredients (name, allergen, "createdAt", "updatedAt") VALUES
('Sauce tomate', false, NOW(), NOW()),
('Mozzarella', true, NOW(), NOW()),
('Basilic', false, NOW(), NOW()),
('Jambon', false, NOW(), NOW()),
('Champignons', false, NOW(), NOW()),
('Origan', false, NOW(), NOW()),
('Olives', false, NOW(), NOW()),
('Anchois', false, NOW(), NOW()),
('Ail', false, NOW(), NOW()),
('Câpres', false, NOW(), NOW());

-- Réinitialiser les séquences après insertion
SELECT setval('pizzas_id_seq', (SELECT MAX(id) FROM pizzas));
SELECT setval('ingredients_id_seq', (SELECT MAX(id) FROM ingredients));
      `;
      
      await this.dataSource.query(sql);
      
      return {
        success: true,
        message: 'Real pizzas updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post('update-pizza-images')
  async updatePizzaImages() {
    try {
      await this.dataSource.query(`
        UPDATE pizzas SET "imageUrl" = '/images/pizzas/calzone.jpg' WHERE name = 'La Calzone';
        UPDATE pizzas SET "imageUrl" = '/images/pizzas/regina.jpg' WHERE name = 'La Regina';
        UPDATE pizzas SET "imageUrl" = '/images/pizzas/caprese.jpg' WHERE name = 'La Caprese';
      `);
      
      return {
        success: true,
        message: 'Pizza images updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post('update-final-menu')
  async updateFinalMenu() {
    try {
      const pizzas = [
        // Traditionnelles
        { name: 'La Marguerite', description: 'Sauce tomate maison, mozzarella, basilic, huile d\'olive', price: 10.00, vegetarian: true, imageUrl: '/images/pizzas/margherita.jpg' },
        { name: 'La Regina', description: 'Sauce tomate maison, mozzarella, jambon, champignons', price: 13.00, vegetarian: false, imageUrl: '/images/pizzas/regina.jpg' },
        { name: 'La Napolitaine', description: 'Sauce tomate maison, mozzarella, anchois, câpres, olives noires', price: 13.00, vegetarian: false, imageUrl: '/images/pizzas/napolitaine.jpg' },
        { name: 'La Caprese', description: 'Sauce tomate maison, mozzarella, tomates fraîches, basilic, huile d\'olive', price: 13.00, vegetarian: true, imageUrl: '/images/pizzas/caprese.jpg' },
        { name: 'La Quatre Saisons', description: 'Sauce tomate maison, mozzarella, jambon, champignons, artichauts, olives', price: 14.00, vegetarian: false, imageUrl: '/images/pizzas/quatre-saisons.jpg' },
        { name: 'La Chèvre Miel', description: 'Sauce tomate maison, mozzarella, fromage de chèvre, miel, noix', price: 14.00, vegetarian: true, imageUrl: '/images/pizzas/chevre-miel.jpg' },
        { name: 'La Quatre Fromages', description: 'Sauce tomate maison, mozzarella, gorgonzola, parmesan, chèvre', price: 14.00, vegetarian: true, imageUrl: '/images/pizzas/quatre-fromages.jpg' },
        { name: 'La Calabrese', description: 'Sauce tomate maison, mozzarella, salami piquant, poivrons, olives', price: 14.00, vegetarian: false, imageUrl: '/images/pizzas/calabrese.jpg' },
        { name: 'La Calzone', description: 'Sauce tomate maison, mozzarella, jambon, champignons, œuf (pizza fermée)', price: 14.00, vegetarian: false, imageUrl: '/images/pizzas/calzone.jpg' },
        { name: 'La Merguez', description: 'Sauce tomate maison, mozzarella, merguez, poivrons, oignons', price: 14.00, vegetarian: false, imageUrl: '/images/pizzas/merguez.jpg' },
        { name: 'La Cannibale', description: 'Sauce tomate maison, mozzarella, jambon, merguez, bœuf haché, chorizo', price: 15.00, vegetarian: false, imageUrl: '/images/pizzas/cannibale.jpg' },
        
        // Signatures
        { name: 'La Lily-Rose', description: 'Sauce tomate maison, mozzarella, jambon de Parme, roquette, parmesan, tomates cerises', price: 15.00, vegetarian: false, imageUrl: '/images/pizzas/lily-rose.jpg' },
        { name: 'La Emmy-Lou', description: 'Crème fraîche, mozzarella, saumon fumé, aneth, citron, oignons rouges', price: 15.00, vegetarian: false, imageUrl: '/images/pizzas/emmy-lou.jpg' },
        { name: 'La Chris', description: 'Sauce tomate maison, aubergine, courgettes, basilic, parmesan, jambon cru après cuisson', price: 15.00, vegetarian: false, imageUrl: '/images/pizzas/chris.jpg' },
        { name: 'La Ludmilove', description: 'Crème fraîche, mozzarella, gorgonzola, noix, miel, poire', price: 15.00, vegetarian: true, imageUrl: '/images/pizzas/ludmilove.jpg' },
        { name: 'La Truffe', description: 'Crème de truffe, mozzarella, champignons, jambon de Parme, parmesan, huile de truffe', price: 18.00, vegetarian: false, imageUrl: '/images/pizzas/truffe.jpg' },
      ];

      // Delete all pizzas
      await this.dataSource.query('DELETE FROM pizzas');

      // Insert new pizzas
      for (const pizza of pizzas) {
        await this.dataSource.query(
          `INSERT INTO pizzas (name, description, price, vegetarian, available, "imageUrl", "preparationTime") 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [pizza.name, pizza.description, pizza.price, pizza.vegetarian, true, pizza.imageUrl, 15]
        );
      }

      return {
        success: true,
        message: `Menu updated successfully with ${pizzas.length} pizzas`,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post('restore-ingredients')
  async restoreIngredients() {
    try {
      // Définition de tous les ingrédients avec leurs allergènes
      const ingredients = [
        { name: 'Sauce tomate', allergen: false },
        { name: 'Mozzarella', allergen: true },
        { name: 'Basilic', allergen: false },
        { name: 'Huile d\'olive', allergen: false },
        { name: 'Jambon', allergen: false },
        { name: 'Champignons', allergen: false },
        { name: 'Anchois', allergen: true },
        { name: 'Câpres', allergen: false },
        { name: 'Olives noires', allergen: false },
        { name: 'Tomates fraîches', allergen: false },
        { name: 'Artichauts', allergen: false },
        { name: 'Olives', allergen: false },
        { name: 'Fromage de chèvre', allergen: true },
        { name: 'Miel', allergen: false },
        { name: 'Noix', allergen: true },
        { name: 'Gorgonzola', allergen: true },
        { name: 'Parmesan', allergen: true },
        { name: 'Chèvre', allergen: true },
        { name: 'Salami piquant', allergen: false },
        { name: 'Poivrons', allergen: false },
        { name: 'Œuf', allergen: true },
        { name: 'Merguez', allergen: false },
        { name: 'Oignons', allergen: false },
        { name: 'Bœuf haché', allergen: false },
        { name: 'Chorizo', allergen: false },
        { name: 'Jambon de Parme', allergen: false },
        { name: 'Roquette', allergen: false },
        { name: 'Tomates cerises', allergen: false },
        { name: 'Crème fraîche', allergen: true },
        { name: 'Saumon fumé', allergen: true },
        { name: 'Aneth', allergen: false },
        { name: 'Citron', allergen: false },
        { name: 'Oignons rouges', allergen: false },
        { name: 'Aubergine', allergen: false },
        { name: 'Courgettes', allergen: false },
        { name: 'Jambon cru', allergen: false },
        { name: 'Poire', allergen: false },
        { name: 'Crème de truffe', allergen: false },
        { name: 'Huile de truffe', allergen: false },
      ];

      // Lien pizza-ingrédients
      const pizzaIngredients = {
        'La Marguerite': ['Sauce tomate', 'Mozzarella', 'Basilic', 'Huile d\'olive'],
        'La Regina': ['Sauce tomate', 'Mozzarella', 'Jambon', 'Champignons'],
        'La Napolitaine': ['Sauce tomate', 'Mozzarella', 'Anchois', 'Câpres', 'Olives noires'],
        'La Caprese': ['Sauce tomate', 'Mozzarella', 'Tomates fraîches', 'Basilic', 'Huile d\'olive'],
        'La Quatre Saisons': ['Sauce tomate', 'Mozzarella', 'Jambon', 'Champignons', 'Artichauts', 'Olives'],
        'La Chèvre Miel': ['Sauce tomate', 'Mozzarella', 'Fromage de chèvre', 'Miel', 'Noix'],
        'La Quatre Fromages': ['Sauce tomate', 'Mozzarella', 'Gorgonzola', 'Parmesan', 'Chèvre'],
        'La Calabrese': ['Sauce tomate', 'Mozzarella', 'Salami piquant', 'Poivrons', 'Olives'],
        'La Calzone': ['Sauce tomate', 'Mozzarella', 'Jambon', 'Champignons', 'Œuf'],
        'La Merguez': ['Sauce tomate', 'Mozzarella', 'Merguez', 'Poivrons', 'Oignons'],
        'La Cannibale': ['Sauce tomate', 'Mozzarella', 'Jambon', 'Merguez', 'Bœuf haché', 'Chorizo'],
        'La Lily-Rose': ['Sauce tomate', 'Mozzarella', 'Jambon de Parme', 'Roquette', 'Parmesan', 'Tomates cerises'],
        'La Emmy-Lou': ['Crème fraîche', 'Mozzarella', 'Saumon fumé', 'Aneth', 'Citron', 'Oignons rouges'],
        'La Chris': ['Sauce tomate', 'Aubergine', 'Courgettes', 'Basilic', 'Parmesan', 'Jambon cru'],
        'La Ludmilove': ['Crème fraîche', 'Mozzarella', 'Gorgonzola', 'Noix', 'Miel', 'Poire'],
        'La Truffe': ['Crème de truffe', 'Mozzarella', 'Champignons', 'Jambon de Parme', 'Parmesan', 'Huile de truffe'],
      };

      // Supprimer les anciens liens et ingrédients
      await this.dataSource.query('DELETE FROM pizza_ingredients');
      await this.dataSource.query('DELETE FROM ingredients');

      // Insérer tous les ingrédients
      const ingredientIds = new Map();
      for (const ing of ingredients) {
        const result = await this.dataSource.query(
          'INSERT INTO ingredients (name, allergen) VALUES ($1, $2) RETURNING id',
          [ing.name, ing.allergen]
        );
        ingredientIds.set(ing.name, result[0].id);
      }

      // Créer les liens pizza-ingrédients
      for (const [pizzaName, ingNames] of Object.entries(pizzaIngredients)) {
        const pizzaResult = await this.dataSource.query(
          'SELECT id FROM pizzas WHERE name = $1',
          [pizzaName]
        );
        
        if (pizzaResult.length > 0) {
          const pizzaId = pizzaResult[0].id;
          for (const ingName of ingNames) {
            const ingId = ingredientIds.get(ingName);
            if (ingId) {
              await this.dataSource.query(
                'INSERT INTO pizza_ingredients (pizza_id, ingredient_id) VALUES ($1, $2)',
                [pizzaId, ingId]
              );
            }
          }
        }
      }

      return {
        success: true,
        message: `Restored ${ingredients.length} ingredients and linked them to pizzas`,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
