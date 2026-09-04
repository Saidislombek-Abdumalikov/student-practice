import { UserProfile } from '../types';
import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';
import { INITIAL_ACCOUNTS } from '../data/accountsData';
import { deduplicateAccounts } from './storageService';

export const SUPABASE_SQL_SETUP = `-- Copy and paste this into Supabase SQL Editor and click RUN:

create table if not exists student_profiles (
  id text primary key,
  username text unique not null,
  password text not null,
  role text not null default 'student',
  name text not null,
  level_id text not null default 'beginner',
  xp integer not null default 0,
  coins integer not null default 0,
  streak_days integer not null default 1,
  gender text not null default 'woman',
  full_profile jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable public access for student sync
alter table student_profiles enable row level security;

drop policy if exists "Public access policy" on student_profiles;
create policy "Public access policy" 
on student_profiles for all 
using (true) 
with check (true);
`;

export class SupabaseService {
  /**
   * Fetch all profiles from Supabase. Returns null if not configured or query fails.
   */
  public static async fetchRemoteAccounts(): Promise<UserProfile[] | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from('student_profiles')
        .select('*')
        .order('xp', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error:', error.message);
        return null;
      }

      if (data && data.length > 0) {
        const parsedProfiles: UserProfile[] = data.map(row => {
          const full = row.full_profile || {};
          return {
            ...full,
            id: row.id,
            username: row.username,
            password: row.password,
            role: row.role,
            name: row.name,
            levelId: row.level_id || full.levelId || 'beginner',
            xp: row.xp ?? full.xp ?? 0,
            coins: row.coins ?? full.coins ?? 0,
            streakDays: row.streak_days ?? full.streakDays ?? 1,
            character: {
              ...(full.character || {}),
              gender: row.gender || full.character?.gender || 'woman',
            },
          } as UserProfile;
        });

        // Delete any stale robiya rows from Supabase
        Promise.resolve(client.from('student_profiles').delete().or('id.eq.usr_robiya,username.eq.robiya')).catch(() => {});

        return deduplicateAccounts(parsedProfiles);
      }

      return [];
    } catch (err) {
      console.warn('Supabase error:', err);
      return null;
    }
  }

  /**
   * Upsert a single profile into Supabase
   */
  public static async saveAccountToRemote(profile: UserProfile): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      const cleanId = profile.id === 'usr_robiya' ? 'usr_roziya' : profile.id;
      const cleanUsername = (profile.username || '').toLowerCase().trim() === 'robiya' ? 'roziya' : (profile.username || '').toLowerCase().trim();
      const cleanName = cleanUsername === 'roziya' ? 'Roziya' : profile.name;

      const row = {
        id: cleanId,
        username: cleanUsername,
        password: cleanUsername === 'omina' ? 'omina' : (profile.password || ''),
        role: cleanUsername === 'roziya' ? 'support' : (profile.role || 'student'),
        name: cleanName || '',
        level_id: profile.levelId || 'beginner',
        xp: profile.xp || 0,
        coins: profile.coins || 0,
        streak_days: profile.streakDays || 1,
        gender: profile.character?.gender || 'woman',
        full_profile: {
          ...profile,
          id: cleanId,
          username: cleanUsername,
          name: cleanName,
        },
        updated_at: new Date().toISOString(),
      };

      const { error } = await client
        .from('student_profiles')
        .upsert(row, { onConflict: 'id' });

      if (error) {
        console.warn('Supabase upsert error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase save error:', err);
      return false;
    }
  }

  /**
   * Batch upsert all accounts to Supabase
   */
  public static async saveAllAccountsToRemote(profiles: UserProfile[]): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client || profiles.length === 0) return false;

    try {
      const deduped = deduplicateAccounts(profiles);

      // Clean up stale robiya
      Promise.resolve(client.from('student_profiles').delete().or('id.eq.usr_robiya,username.eq.robiya')).catch(() => {});

      const rows = deduped.map(profile => ({
        id: profile.id,
        username: (profile.username || '').toLowerCase().trim(),
        password: profile.password || '',
        role: profile.role || 'student',
        name: profile.name || '',
        level_id: profile.levelId || 'beginner',
        xp: profile.xp || 0,
        coins: profile.coins || 0,
        streak_days: profile.streakDays || 1,
        gender: profile.character?.gender || 'woman',
        full_profile: profile,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await client
        .from('student_profiles')
        .upsert(rows, { onConflict: 'id' });

      if (error) {
        console.warn('Supabase batch upsert error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase batch save error:', err);
      return false;
    }
  }

  /**
   * Delete an account from Supabase by ID
   */
  public static async deleteAccountFromRemote(studentId: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      const { error } = await client
        .from('student_profiles')
        .delete()
        .eq('id', studentId);

      if (error) {
        console.warn('Supabase delete error:', error.message);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Seed default accounts into Supabase if empty
   */
  public static async seedInitialAccountsToRemote(): Promise<boolean> {
    return this.saveAllAccountsToRemote(INITIAL_ACCOUNTS);
  }

  /**
   * Subscribe to real-time changes on student_profiles table.
   * Returns an unsubscribe callback.
   */
  public static subscribeToRemoteAccounts(onUpdate: () => void): () => void {
    const client = getSupabaseClient();
    if (!client) return () => {};

    try {
      const channel = client
        .channel('student_profiles_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'student_profiles' },
          () => {
            onUpdate();
          }
        )
        .subscribe();

      return () => {
        try {
          client.removeChannel(channel);
        } catch {
          // Ignored
        }
      };
    } catch {
      return () => {};
    }
  }
}
