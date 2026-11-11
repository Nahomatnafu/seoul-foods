# Real inventory draft — November 11, 2026

This draft replaces the 16 fictional products with 100 items selected from the merchant's October 29 inventory export. Names, item IDs, barcodes and prices are source-derived. The full audit and original import mappings, including raw SKUs and source rows, remain outside this repository in the local audit output directory. Raw SKU fields may contain supplier notes and must not be published.

The customer catalog is an allowlist in `lib/catalog-data.json`. It omits costs, supplier notes, raw SKU text, unsupported origin/size/spice claims, and stock counts. The server-only catalog module handles query/category/pagination. Only 24 products are rendered per catalog page. Product URLs include the full Clover ID and should be retained when names change.

The bag stores IDs and quantities under a versioned local-storage key. `/api/bag` resolves names and integer-cent prices from the server snapshot. Client-provided prices are ignored. Unknown IDs are dropped; quantities are constrained to 1–99. This is an estimate only, with no ordering, reservations, or payment integration. Any future live order must revalidate Clover prices, availability, taxes, and inventory on the server.

## Photos

63 package photographs were matched by normalized GTIN, source name and visual review. Attribution and license records are in `lib/product-image-sources.json` and visible at `/credits`. Source photographs are served proportionally and were not edited. Source: Open Food Facts contributors, CC BY-SA 3.0. Merchant confirmation of current packaging is still needed.

37 products have a clearly labeled photo-pending treatment. Ambiguous pack-count/flavor/brand images and unrelated photos were held out. Downloaded rejects were moved out of public assets into the private audit output folder. Open Food Facts metadata was used only to match and attribute photographs, never for the store's names or prices.

## Convenience-store presentation

The home page and categories describe packaged groceries, snacks, noodles, drinks, pantry staples, refrigerated groceries and frozen products. Plated ramen and prepared-dumpling category photos are no longer used. The old pickup-booking form, restaurant-style confirmation, unsupported origin/size/heat attributes, invented store history and unverified opening hours have been removed. The existing supplied logo and red/blue brand palette are retained.

## Meeting walkthrough

1. Home: explain the convenience-store concept and show real product packages.
2. Shop: browse the 100 selected products, filter aisles, search a name or barcode, and use pagination.
3. Product: open a direct URL and compare its name, barcode and exported price with the merchant's item.
4. Demo bag: add two products, change quantities and show the estimated subtotal. No order or payment is sent.
5. Ask for authorized production Clover access with Read Inventory permission. Confirm stock tracking, deleted/available fields, and the `99` price-label practice before live synchronization. A developer account by itself does not authorize access to their merchant account.

## Clover next step

Clover's current item API can filter on price, available, deleted, autoManage, itemStock.quantity, and age-restriction fields; itemStock and category data can be expanded. Read permissions must be granted by the merchant through the supported authorization flow. Production developer activation and app permissions must be in place; employee permissions should not be assumed to grant API access.

Use Clover as the source of truth once authorized. First perform a read-only reconciliation against this snapshot. API access will expose current Clover settings but will not automatically fix incorrectly tracked stock or distinguish every historical scale label without merchant input. Keep all tokens on the server. Do not enable live payment or ordering during this step.

Official references checked November 11, 2026:

- https://docs.clover.com/dev/docs/use-oauth
- https://docs.clover.com/dev/docs/permissions
- https://docs.clover.com/dev/reference/inventorygetitems
- https://openfoodfacts.github.io/documentation/docs/Product-Opener/api/

Production remains subject to the user's approval. Use a separate draft branch and preview deployment for review.
