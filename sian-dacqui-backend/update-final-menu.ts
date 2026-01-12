import { DataSource } from 'typeorm';

const pizzas = [
  // Traditionnelles
  { name: 'La Marguerite', description: 'Sauce tomate maison, mozzarella, basilic, huile d\'olive', price: 10.00, category: 'Traditionnelle', image_url: '/images/pizzas/margherita.jpg', allergens: ['gluten', 'lait'], is_vegetarian: true },
  { name: 'La Regina', description: 'Sauce tomate maison, mozzarella, jambon, champignons', price: 13.00, category: 'Traditionnelle', image_url: '/images/pizzas/regina.jpg', allergens: ['gluten', 'lait'], is_vegetarian: false },
  { name: 'La Napolitaine', description: 'Sauce tomate maison, mozzarella, anchois, câpres, olives noires', price: 13.00, category: 'Traditionnelle', image_url: '/images/pizzas/napolitaine.jpg', allergens: ['gluten', 'lait', 'poisson'], is_vegetarian: false },
  { name: 'La Caprese', description: 'Sauce tomate maison, mozzarella, tomates fraîches, basilic, huile d\'olive', price: 13.00, category: 'Traditionnelle', image_url: '/images/pizzas/caprese.jpg', allergens: ['gluten', 'lait'], is_vegetarian: true },
  { name: 'La Quatre Saisons', description: 'Sauce tomate maison, mozzarella, jambon, champignons, artichauts, olives', price: 14.00, category: 'Traditionnelle', image_url: '/images/pizzas/quatre-saisons.jpg', allergens: ['gluten', 'lait'], is_vegetarian: false },
  { name: 'La Chèvre Miel', description: 'Sauce tomate maison, mozzarella, fromage de chèvre, miel, noix', price: 14.00, category: 'Traditionnelle', image_url: '/images/pizzas/chevre-miel.jpg', allergens: ['gluten', 'lait', 'fruits à coque'], is_vegetarian: true },
  { name: 'La Quatre Fromages', description: 'Sauce tomate maison, mozzarella, gorgonzola, parmesan, chèvre', price: 14.00, category: 'Traditionnelle', image_url: '/images/pizzas/quatre-fromages.jpg', allergens: ['gluten', 'lait'], is_vegetarian: true },
  { name: 'La Calabrese', description: 'Sauce tomate maison, mozzarella, salami piquant, poivrons, olives', price: 14.00, category: 'Traditionnelle', image_url: '/images/pizzas/calabrese.jpg', allergens: ['gluten', 'lait'], is_vegetarian: false },
  { name: 'La Calzone', description: 'Sauce tomate maison, mozzarella, jambon, champignons, œuf (pizza fermée)', price: 14.00, category: 'Traditionnelle', image_url: '/images/pizzas/calzone.jpg', allergens: ['gluten', 'lait', 'œufs'], is_vegetarian: false },
  { name: 'La Merguez', description: 'Sauce tomate maison, mozzarella, merguez, poivrons, oignons', price: 14.00, category: 'Traditionnelle', image_url: '/images/pizzas/merguez.jpg', allergens: ['gluten', 'lait'], is_vegetarian: false },
  { name: 'La Cannibale', description: 'Sauce tomate maison, mozzarella, jambon, merguez, bœuf haché, chorizo', price: 15.00, category: 'Traditionnelle', image_url: '/images/pizzas/cannibale.jpg', allergens: ['gluten', 'lait'], is_vegetarian: false },
  
  // Signatures
  { name: 'La Lily-Rose', description: 'Sauce tomate maison, mozzarella, jambon de Parme, roquette, parmesan, tomates cerises', price: 15.00, category: 'Signature', image_url: '/images/pizzas/lily-rose.jpg', allergens: ['gluten', 'lait'], is_vegetarian: false },
  { name: 'La Emmy-Lou', description: 'Crème fraîche, mozzarella, saumon fumé, aneth, citron, oignons rouges', price: 15.00, category: 'Signature', image_url: '/images/pizzas/emmy-lou.jpg', allergens: ['gluten', 'lait', 'poisson'], is_vegetarian: false },
  { name: 'La Chris', description: 'Sauce tomate maison, aubergine, courgettes, basilic, parmesan, jambon cru après cuisson', price: 15.00, category: 'Signature', image_url: '/images/pizzas/chris.jpg', allergens: ['gluten', 'lait'], is_vegetarian: false },
  { name: 'La Ludmilove', description: 'Crème fraîche, mozzarella, gorgonzola, noix, miel, poire', price: 15.00, category: 'Signature', image_url: '/images/pizzas/ludmilove.jpg', allergens: ['gluten', 'lait', 'fruits à coque'], is_vegetarian: true },
  { name: 'La Truffe', description: 'Crème de truffe, mozzarella, champignons, jambon de Parme, parmesan, huile de truffe', price: 18.00, category: 'Signature', image_url: '/images/pizzas/truffe.jpg', allergens: ['gluten', 'lait'], is_vegetarian: false },
];

async function updateMenu() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ['dist/**/*.entity.js'],
    synchronize: false,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await dataSource.initialize();
    console.log('Connected to database');

    // Delete all pizzas
    await dataSource.query('DELETE FROM pizza');
    console.log('Deleted all existing pizzas');

    // Insert new pizzas
    for (const pizza of pizzas) {
      await dataSource.query(
        `INSERT INTO pizza (name, description, price, category, image_url, allergens, is_vegetarian, available) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [pizza.name, pizza.description, pizza.price, pizza.category, pizza.image_url, pizza.allergens, pizza.is_vegetarian, true]
      );
      console.log(`Inserted: ${pizza.name}`);
    }

    console.log('\n✅ Menu updated successfully!');
    console.log(`Total pizzas: ${pizzas.length}`);
    
    await dataSource.destroy();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateMenu();
