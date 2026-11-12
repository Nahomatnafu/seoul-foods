'use server';

import { redirect } from 'next/navigation';
import { signInAdmin, signOutAdmin } from '@/lib/admin-session';

export async function signIn(_previous: string, form: FormData) {
  if (!await signInAdmin(String(form.get('password') ?? ''))) return 'The password is incorrect.';
  redirect('/admin');
}

export async function signOut() {
  await signOutAdmin();
  redirect('/admin');
}
