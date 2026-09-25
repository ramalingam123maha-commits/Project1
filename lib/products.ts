import { Product } from "./types";

const categories = ["Electronics", "Apparel", "Home & Kitchen", "Sports", "Books", "Toys"];

const adjectives = [
  "Premium", "Compact", "Wireless", "Eco-Friendly", "Classic", "Portable",
  "Deluxe", "Smart", "Handmade", "Ultra", "Everyday", "Professional",
];

const nouns = [
  "Headphones", "Backpack", "Water Bottle", "Desk Lamp", "Running Shoes",
  "Coffee Maker", "Yoga Mat", "Bluetooth Speaker", "Notebook Set", "Board Game",
  "Sunglasses", "Blender", "Camera Tripod", "Table Lamp", "Sneakers", "Jacket",
];

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function buildCatalog(): Product[] {
  const rand = seededRandom(42);
  const products: Product[] = [];

  for (let i = 0; i < 48; i++) {
    const category = categories[i % categories.length];
    const adjective = adjectives[Math.floor(rand() * adjectives.length)];
    const noun = nouns[Math.floor(rand() * nouns.length)];
    const price = Math.round((10 + rand() * 190) * 100) / 100;
    const rating = Math.round((3 + rand() * 2) * 10) / 10;
    const inStock = rand() > 0.15;

    products.push({
      id: `prod-${i + 1}`,
      name: `${adjective} ${noun}`,
      category,
      price,
      rating,
      image: `https://picsum.photos/seed/prod-${i + 1}/400/400`,
      description: `A ${adjective.toLowerCase()} ${noun.toLowerCase()} designed for everyday use, offering great value and reliable quality in the ${category.toLowerCase()} category.`,
      inStock,
    });
  }

  return products;
}

export const PRODUCTS: Product[] = buildCatalog();

export const CATEGORIES = categories;
