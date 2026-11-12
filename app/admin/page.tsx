import type { Metadata } from 'next';
import Link from 'next/link';
import { isAdminConfigured, isAdminSignedIn } from '@/lib/admin-session';
import { catalogStorage, loadCatalog } from '@/lib/catalog-store';
import { signOut } from './actions';
import { AdminLogin } from './login';
import { Dashboard } from './dashboard';
import './admin.css';

export const metadata: Metadata = { title: 'Store dashboard', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const configured = isAdminConfigured();
  const signedIn = configured && await isAdminSignedIn();
  const storage = catalogStorage();
  const catalog = signedIn ? await loadCatalog() : null;

  return (
    <main className="admin-shell">
      <section className="admin-hero">
        <div className="admin-width admin-hero-inner">
          <div>
            <p className="eyebrow light">Seoul Foods</p>
            <h1>Store dashboard</h1>
            <p>Manage the products and categories customers see on the website.</p>
          </div>
          {signedIn && <div className="admin-hero-actions">
            <Link className="button button-white" href="/shop">View shop <span aria-hidden="true">↗</span></Link>
            <form action={signOut}><button className="admin-link" type="submit">Sign out</button></form>
          </div>}
        </div>
      </section>
      <div className="admin-width admin-content">
        {catalog
          ? <Dashboard initialCatalog={catalog} storage={storage} />
          : <section className="admin-panel admin-login">
            <h2>Staff sign-in</h2>
            {configured ? <AdminLogin /> : <p>Staff sign-in will be available once a dashboard password is set.</p>}
          </section>}
      </div>
    </main>
  );
}
