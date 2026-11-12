'use client';

import { useActionState } from 'react';
import { signIn } from './actions';

export function AdminLogin() {
  const [error, action, pending] = useActionState(signIn, '');
  return <form action={action} className="admin-form">
    <label htmlFor="staff-password">Dashboard password</label>
    <input id="staff-password" name="password" type="password" autoComplete="current-password" maxLength={1024} required />
    {error && <p className="admin-error" role="alert">{error}</p>}
    <button className="button button-blue" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>
  </form>;
}
