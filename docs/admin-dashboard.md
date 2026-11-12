# Seoul Foods dashboard

The staff dashboard is at `/admin`. It starts with the 100 products on the website. Staff can create and rename categories, assign multiple categories to a product, delete categories, and add or edit a product's name, USD price, barcode and photo. Deleting a category keeps its products and any other assigned categories. Product links retain the original ID and slug after a rename.

## Local draft

Run `pnpm install` and `pnpm dev --hostname 127.0.0.1`. Set `SEOUL_ADMIN_PASSWORD` in `.env.local` to a unique randomly generated password of at least 24 characters before starting the server. Open `http://localhost:3000/admin` and sign in. Edits and uploads persist in the ignored `.catalog-local` directory and appear in the local storefront. Use a separate checkout or back up that directory to keep a copy of local edits.

## Hosted setup after review

Apply [catalog.sql](../supabase/catalog.sql) in the chosen Supabase project and set `SUPABASE_URL`, `SUPABASE_SECRET_KEY` and `SEOUL_ADMIN_PASSWORD` in the corresponding Vercel environment. Use separate projects or credentials for draft and production data. The initial catalog comes from the checked-in snapshot. Local edits require an explicit transfer if the store wants to keep them. The Supabase secret stays on the server. Uploaded product images are served through the website from a private storage bucket.

Use the current project owner's accounts for the draft. The client plans to use the store's email for GitHub, Vercel, Resend and Supabase. At handoff, move the repository and deployment to their accounts and set up staff identities with Supabase Auth and store-owned email delivery through Resend. The current draft uses a shared dashboard password.

## Clover

The 100 imported products retain the Clover item IDs from the export. Products added in the dashboard start as website catalog records. Once the merchant authorizes access, reconcile items against Clover IDs and review barcode matches before enabling inventory writes. Request Inventory Read for reconciliation and Inventory Write for authorized changes to item records and category associations. Keep storefront photos in Supabase. Stock quantities have their own Clover API and need a separate review before enabling stock changes.

- [Clover authorization](https://docs.clover.com/dev/docs/use-oauth)
- [Clover inventory permissions](https://docs.clover.com/dev/docs/permissions)
- [Clover category associations](https://docs.clover.com/dev/docs/inventory-faqs)
