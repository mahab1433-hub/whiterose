import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';

const ADMIN_EMAILS = ['mahab1433@gmail.com', 'babutmuthumari@gmail.com', 'gayathrirose1726@gmail.com', 'support.whiterosebeautyparlour@gmail.com'];

export async function getServerSupabase() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const authHeader = headersList.get('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dchnqqqzstrglofnuvwb.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaG5xcXF6c3RyZ2xvZm51dndiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMjg3OTAsImV4cCI6MjA5MTcwNDc5MH0.-l8T8lTJuVRHpkWPkLX4WAbuLKNGYF7EXNOQfqt0ddc';

  const client = createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // Ignore if called in route handler response phase
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch (error) {
          // Ignore if called in route handler response phase
        }
      },
    },
  });

  if (token) {
    // Avoid setting an empty refresh token as it might throw or fail validation
    const { error } = await client.auth.setSession({
      access_token: token,
      refresh_token: 'dummy_refresh_token_to_bypass_validation'
    });
    if (error) console.error('setSession error:', error);
  }

  return client;
}

export async function getAuthenticatedUser() {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;

    const supabase = await getServerSupabase();
    const { data: { user }, error } = token 
      ? await supabase.auth.getUser(token) 
      : await supabase.auth.getUser();
      
    if (error || !user) {
      console.error('getAuthenticatedUser check failed:', error);
      return null;
    }
    return user;
  } catch (e) {
    console.error('getAuthenticatedUser exception:', e);
    return null;
  }
}

export function isUserAdmin(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
}
