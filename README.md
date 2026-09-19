# Seoul Foods frontend demo

A responsive, multi-page website concept for Seoul Foods, an Asian convenience market in North Mankato, Minnesota.

## Included

- Branded home page using the supplied Seoul Foods identity
- Filterable sample product catalog
- Individual product pages
- Browser-persistent pickup bag
- Pickup date and time selection
- Store information and directions page
- Responsive desktop and mobile layouts

This is a frontend demonstration. Product availability, pricing, pickup requests, and payments are not connected to a backend.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Content updates

Sample products are stored in `lib/products.ts`. Store details and hours are in `app/visit/page.tsx`. Colors and layout rules are in `app/globals.css`.

## Deployment

The project is configured for Vercel using the standard Next.js build command.

## Demo photography

Category photography is sourced from Unsplash and used under the Unsplash License:

- Ramen by Alison Marras: https://unsplash.com/photos/bowl-of-ramen-SdS_XZ2CBqo
- Drinks by Haberdoedas: https://unsplash.com/photos/drinks-and-beverages-are-stocked-in-a-refrigerator-kNpudnaMpZs
- Market snacks by Stephen Kong: https://unsplash.com/photos/a-display-in-a-grocery-store-filled-with-lots-of-food-wb1iWdQBeNk
- Dumplings by Abhishek Sanwa Limbu: https://unsplash.com/photos/dumpling-dishes-LR559Dcst70
