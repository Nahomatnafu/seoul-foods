'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Catalog, CatalogItem, Category } from '@/lib/catalog-types';
import { formatPrice } from '@/lib/product-types';

type Editor = { kind: 'product' | 'category' | 'delete-category'; id: string };
type SaveResponse = { catalog?: Catalog; error?: string };

const pageSize = 12;

function ProductPhoto({ src, size }: { src: string | null; size: number }) {
  return <div className="admin-photo" style={{ width: size, height: size }}>
    {src ? <Image src={src} alt="" width={size} height={size} unoptimized /> : <span aria-label="No photo">—</span>}
  </div>;
}

function ProductEditor({ item, categories }: { item?: CatalogItem; categories: Category[] }) {
  const [photo, setPhoto] = useState<string | null>(null);
  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo); }, [photo]);

  return <>
    <label htmlFor="product-name">Product name</label>
    <input id="product-name" name="name" required maxLength={140} defaultValue={item?.name} />
    <div className="admin-fields">
      <div>
        <label htmlFor="product-price">Price in USD</label>
        <input id="product-price" name="price" inputMode="decimal" required placeholder="0.00"
          defaultValue={item ? (item.priceCents / 100).toFixed(2) : ''} />
      </div>
      <div>
        <label htmlFor="product-barcode">Barcode <small>optional</small></label>
        <input id="product-barcode" name="barcode" inputMode="numeric" maxLength={14} defaultValue={item?.barcode} />
      </div>
    </div>
    <fieldset>
      <legend>Categories</legend>
      {categories.length ? <div className="admin-checks">
        {categories.map(category => <label className="admin-check" key={category.id}>
          <input type="checkbox" name="categories" value={category.id} defaultChecked={item?.categoryIds.includes(category.id)} />
          {category.name}
        </label>)}
      </div> : <p className="admin-muted">Create categories from the Categories tab.</p>}
    </fieldset>
    <div className="admin-upload">
      <ProductPhoto src={photo ?? item?.image ?? null} size={72} />
      <div>
        <label htmlFor="product-photo">{item?.image ? 'Replace photo' : 'Product photo'}</label>
        <input id="product-photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp"
          aria-describedby="photo-help" onChange={event => {
            const file = event.target.files?.[0];
            setPhoto(file ? URL.createObjectURL(file) : null);
          }} />
        <small id="photo-help">JPG, PNG, or WebP up to 3 MB.</small>
      </div>
    </div>
    {item?.cloverItemId && <p className="admin-muted">Clover item ID <code>{item.cloverItemId}</code></p>}
  </>;
}

export function Dashboard({ initialCatalog, storage }: {
  initialCatalog: Catalog;
  storage: 'local' | 'supabase' | 'read-only';
}) {
  const [catalog, setCatalog] = useState(initialCatalog);
  const [tab, setTab] = useState<'products' | 'categories'>('products');
  const [editor, setEditor] = useState<Editor | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [conflict, setConflict] = useState(false);
  const [pending, setPending] = useState(false);
  const panel = useRef<HTMLElement>(null);
  const editable = storage !== 'read-only';

  const categories = new Map(catalog.categories.map(category => [category.id, category.name]));
  const counts = new Map<string, number>();
  for (const item of catalog.items) {
    for (const id of item.categoryIds) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  const search = query.trim().normalize('NFKC').toLowerCase();
  const matching = catalog.items.filter(item => {
    const inCategory = !filter || (filter === 'uncategorized' ? !item.categoryIds.length : item.categoryIds.includes(filter));
    return inCategory && [item.name, item.barcode].some(value => value.normalize('NFKC').toLowerCase().includes(search));
  });
  const pages = Math.max(1, Math.ceil(matching.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = matching.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const item = catalog.items.find(item => item.id === editor?.id);
  const category = catalog.categories.find(category => category.id === editor?.id);

  useEffect(() => {
    if (editor) panel.current?.focus({ preventScroll: false });
  }, [editor]);

  function open(next: Editor | null) {
    setError('');
    setNotice('');
    setEditor(next);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor || pending || conflict) return;
    const form = new FormData(event.currentTarget);
    form.set('id', editor.id);
    form.set('revision', String(catalog.revision));
    form.set('operation', editor.kind === 'delete-category' ? editor.kind : 'save-' + editor.kind);
    setPending(true);
    setError('');
    try {
      const response = await fetch('/api/admin/catalog', { method: 'POST', body: form });
      const result = await response.json() as SaveResponse;
      if (!response.ok || !result.catalog) {
        setConflict(response.status === 409);
        setError(result.error || 'Could not save your changes.');
        return;
      }
      setCatalog(result.catalog);
      if (editor.kind === 'delete-category') {
        if (filter === editor.id) setFilter('');
        setNotice('Category deleted.');
      } else if (editor.kind === 'product') {
        if (!editor.id) {
          setQuery(String(form.get('name') ?? '').trim());
          setFilter('');
          setPage(1);
        }
        setNotice(editor.id ? 'Product updated.' : 'Product added to the shop.');
      } else {
        setNotice(editor.id ? 'Category renamed.' : 'Category added.');
      }
      setEditor(null);
    } catch {
      setError('Could not save your changes. Try again.');
    } finally {
      setPending(false);
    }
  }

  return <>
    <div className="admin-overview">
      <div><strong>{catalog.items.length}</strong><span>Products</span></div>
      <div><strong>{catalog.categories.length}</strong><span>Categories</span></div>
      <div><strong>Clover</strong><span>Connection pending</span></div>
    </div>
    {storage === 'local' && <p className="admin-mode">Local draft · Saved changes appear in this copy of the shop.</p>}
    {storage === 'read-only' && <p className="admin-mode">Hosted edits will be available once catalog storage is connected.</p>}
    <nav className="admin-tabs" aria-label="Catalog sections">
      {(['products', 'categories'] as const).map(name => <button key={name} type="button" disabled={pending}
        aria-pressed={tab === name} onClick={() => { setTab(name); open(null); }}>{name === 'products' ? 'Products' : 'Categories'}</button>)}
    </nav>
    <p className="admin-notice" role="status">{notice}</p>
    <div className={editor ? 'admin-grid with-editor' : 'admin-grid'}>
      <section className="admin-panel admin-list" aria-labelledby="catalog-heading">
        <div className="admin-panel-heading">
          <h2 id="catalog-heading">{tab === 'products' ? 'Products' : 'Categories'}</h2>
          <button className="button button-red" disabled={!editable || pending || conflict} type="button"
            onClick={() => open({ kind: tab === 'products' ? 'product' : 'category', id: '' })}>
            <span aria-hidden="true">+</span> {tab === 'products' ? 'Add product' : 'Add category'}
          </button>
        </div>
        {tab === 'products' ? <>
          <div className="admin-filters">
            <label>Search products<input type="search" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} placeholder="Name or barcode" /></label>
            <label>Filter by category<select value={filter} onChange={event => { setFilter(event.target.value); setPage(1); }}>
              <option value="">All categories</option>
              {catalog.categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
              <option value="uncategorized">Uncategorized</option>
            </select></label>
          </div>
          {visible.length ? <ul className="admin-rows">
            {visible.map(product => <li key={product.id} className="admin-product-row">
              <ProductPhoto src={product.image} size={50} />
              <div className="admin-row-name">
                <strong>{product.name}</strong>
                <span>{product.categoryIds.map(id => categories.get(id)).join(' · ') || 'Uncategorized'}</span>
              </div>
              <strong>{formatPrice(product.priceCents)}</strong>
              <button type="button" className="admin-row-button" disabled={!editable || pending || conflict}
                aria-label={`Edit ${product.name}`} onClick={() => open({ kind: 'product', id: product.id })}>Edit</button>
            </li>)}
          </ul> : <p className="admin-empty">No products match this search.</p>}
          {pages > 1 && <div className="admin-pagination">
            <button type="button" className="admin-row-button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button>
            <span>Page {currentPage} of {pages}</span>
            <button type="button" className="admin-row-button" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}>Next</button>
          </div>}
        </> : catalog.categories.length ? <ul className="admin-rows">
          {catalog.categories.map(category => <li key={category.id} className="admin-category-row">
            <div className="admin-row-name"><strong>{category.name}</strong><span>{counts.get(category.id) ?? 0} assigned products</span></div>
            <button className="admin-row-button" type="button" disabled={!editable || pending || conflict}
              aria-label={`Rename ${category.name}`} onClick={() => open({ kind: 'category', id: category.id })}>Rename</button>
            <button className="admin-row-button danger" type="button" disabled={!editable || pending || conflict}
              aria-label={`Delete ${category.name}`} onClick={() => open({ kind: 'delete-category', id: category.id })}>Delete</button>
          </li>)}
        </ul> : <p className="admin-empty">Add a category to organize products in the shop.</p>}
      </section>

      {editor && <section className="admin-panel admin-editor" tabIndex={-1} ref={panel} aria-labelledby="editor-heading">
        <h2 id="editor-heading">
          {editor.kind === 'delete-category' ? 'Delete category' : `${editor.id ? 'Edit' : 'Add'} ${editor.kind}`}
        </h2>
        <form className="admin-form" onSubmit={save} key={editor.kind + editor.id}>
          {editor.kind === 'product' && <ProductEditor item={item} categories={catalog.categories} />}
          {editor.kind === 'category' && <>
            <label htmlFor="category-name">Category name</label>
            <input id="category-name" name="name" defaultValue={category?.name} maxLength={60} required />
          </>}
          {editor.kind === 'delete-category' && <p>
            Remove <strong>{category?.name}</strong> from the shop and its {counts.get(editor.id) ?? 0} assigned products.
            Products stay in the catalog and keep any other categories.
          </p>}
          {error && <p className="admin-error" role="alert">{error}</p>}
          <div className="admin-form-actions">
            {conflict ? <button className="button button-blue" type="button" onClick={() => window.location.reload()}>Reload dashboard</button>
              : <button className={`button ${editor.kind === 'delete-category' ? 'button-red' : 'button-blue'}`} type="submit" disabled={pending}>
                {pending ? 'Saving…' : editor.kind === 'delete-category' ? 'Delete category' : 'Save changes'}
              </button>}
            <button type="button" className="admin-row-button" disabled={pending || conflict} onClick={() => open(null)}>Cancel</button>
          </div>
        </form>
      </section>}
    </div>
  </>;
}
