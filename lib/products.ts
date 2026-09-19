export type Product = {
  slug: string;
  name: string;
  price: number;
  category: string;
  origin: string;
  tag?: string;
  emoji: string;
  accent: string;
  description: string;
  size: string;
  spicy?: number;
};

export const products: Product[] = [
  { slug: "buldak-carbonara-ramen", name: "Buldak Carbonara Ramen", price: 2.99, category: "Noodles", origin: "Korea", tag: "Campus favorite", emoji: "🍜", accent: "pink", size: "130 g", spicy: 4, description: "Creamy, chewy and unapologetically spicy—an after-class classic with a carbonara twist." },
  { slug: "shin-black-noodle-soup", name: "Shin Black Noodle Soup", price: 3.49, category: "Noodles", origin: "Korea", tag: "Best seller", emoji: "🥘", accent: "red", size: "101 g", spicy: 3, description: "A rich beef-bone style broth with mushrooms, garlic and a steady kick of heat." },
  { slug: "peach-ramune", name: "Peach Ramune Soda", price: 3.29, category: "Drinks", origin: "Japan", tag: "Pop it open", emoji: "🥤", accent: "blue", size: "200 ml", description: "Bright peach soda in the iconic marble bottle—crisp, fizzy and made for snack runs." },
  { slug: "strawberry-milk", name: "Strawberry Milk", price: 2.79, category: "Drinks", origin: "Korea", tag: "Chilled", emoji: "🍓", accent: "pink", size: "200 ml", description: "Smooth strawberry milk with a mellow sweetness. Best served ice cold." },
  { slug: "honey-butter-chips", name: "Honey Butter Chips", price: 4.49, category: "Snacks", origin: "Korea", tag: "Sweet + salty", emoji: "🍯", accent: "yellow", size: "60 g", description: "Thin, crisp potato chips dusted with a sweet honey-butter seasoning." },
  { slug: "seaweed-snack", name: "Roasted Seaweed Snack", price: 1.99, category: "Snacks", origin: "Korea", tag: "Light bite", emoji: "🌊", accent: "green", size: "15 g", description: "Crisp roasted seaweed sheets with sesame oil and just enough sea salt." },
  { slug: "matcha-pocky", name: "Matcha Biscuit Sticks", price: 3.99, category: "Sweets", origin: "Japan", tag: "Tea time", emoji: "🍵", accent: "green", size: "70 g", description: "Crisp biscuit sticks dipped in a smooth matcha-flavored coating." },
  { slug: "choco-pie", name: "Chocolate Marshmallow Pies", price: 5.49, category: "Sweets", origin: "Korea", tag: "Share pack", emoji: "🍫", accent: "red", size: "6 pack", description: "Soft cakes layered with marshmallow and wrapped in chocolate." },
  { slug: "mango-mochi", name: "Mango Mochi", price: 4.99, category: "Sweets", origin: "Taiwan", tag: "Soft + chewy", emoji: "🥭", accent: "yellow", size: "120 g", description: "Pillowy rice cakes with a bright mango center and delicate sweetness." },
  { slug: "kimchi-dumplings", name: "Kimchi Dumplings", price: 7.99, category: "Frozen", origin: "Korea", tag: "Freezer pick", emoji: "🥟", accent: "blue", size: "680 g", spicy: 2, description: "Savory vegetable dumplings with tangy kimchi—pan-fry, steam or add to soup." },
  { slug: "melon-ice-bar", name: "Melon Ice Bar", price: 2.49, category: "Frozen", origin: "Korea", tag: "Cool down", emoji: "🍈", accent: "green", size: "70 ml", description: "Creamy melon-flavored ice cream in a soft, chewy shell." },
  { slug: "mango-ice-cream", name: "Mango Ice Cream", price: 6.49, category: "Frozen", origin: "Thailand", tag: "Store favorite", emoji: "🍦", accent: "yellow", size: "4 pack", description: "Tropical mango ice cream with a creamy finish and bright fruit flavor." },
  { slug: "gochujang", name: "Gochujang Chili Paste", price: 6.99, category: "Pantry", origin: "Korea", tag: "Pantry essential", emoji: "🌶️", accent: "red", size: "500 g", spicy: 3, description: "Deep, fermented chili paste for marinades, stews, bibimbap and quick sauces." },
  { slug: "chili-crisp", name: "Garlic Chili Crisp", price: 8.49, category: "Pantry", origin: "China", tag: "Put it on everything", emoji: "🔥", accent: "red", size: "210 g", spicy: 3, description: "Crunchy garlic, chiles and savory aromatics packed into one spoonable condiment." },
  { slug: "tteokbokki-cup", name: "Sweet & Spicy Tteokbokki", price: 4.99, category: "Quick Meals", origin: "Korea", tag: "Ready in minutes", emoji: "🍢", accent: "pink", size: "140 g", spicy: 3, description: "Chewy rice cakes in a sweet-spicy gochujang sauce for a fast, satisfying snack." },
  { slug: "jasmine-milk-tea", name: "Jasmine Milk Tea", price: 3.49, category: "Drinks", origin: "Taiwan", tag: "Chilled", emoji: "🧋", accent: "blue", size: "500 ml", description: "Fragrant jasmine tea softened with milk for an easy, refreshing sip." },
];

export const categories = ["All", "Snacks", "Sweets", "Drinks", "Noodles", "Frozen", "Pantry", "Quick Meals"];

export const featuredProducts = products.slice(0, 8);

export const productImage = (category: string) => {
  if (category === "Drinks") return "/category-drinks.avif";
  if (category === "Frozen") return "/category-frozen.avif";
  if (category === "Noodles" || category === "Quick Meals") return "/category-noodles.avif";
  return "/category-snacks.avif";
};

export const formatPrice = (price: number) => `$${price.toFixed(2)}`;
