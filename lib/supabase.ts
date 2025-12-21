import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://inhtxjcfixllumuqkizw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluaHR4amNmaXhsbHVtdXFraXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4ODQzMDEsImV4cCI6MjA4MTQ2MDMwMX0.dx1_vTaEKwGTKqCy3x5p-IoU0IKSpS6nml3lwm_kQbg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sign Up Function
export const signUp = async (firstName: string, lastName: string, email: string, password: string, notificationChannel: string) => {
  try {
    // Build a redirect URL that works for both local dev and production
    const emailRedirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/login`
        : 'https://back2-youu.vercel.app/login';

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
      },
    });

    if (error) throw error;

    let userProfile = null;

    // Store additional user data in custom user_profiles table via backend API
    if (data.user) {
      try {
        console.log('Attempting to insert profile for user:', data.user.id);
        
        // Call backend API to insert profile (uses service role key)
        const response = await fetch('/api/signup-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: data.user.id,
            email: data.user.email,
            firstName,
            lastName,
          }),
        });

        const responseData = await response.json();

        if (!response.ok) {
          console.error('Profile insertion error:', responseData.error);
          console.warn('Warning: Could not store user profile:', responseData.error);
        } else {
          console.log('Profile inserted successfully');
          // If insert successful, set the profile
          userProfile = {
            user_id: data.user.id,
            user_email: data.user.email,
            user_fname: firstName,
            user_lname: lastName,
          };
        }
      } catch (profileError) {
        console.error('Profile storage error:', profileError);
      }

      // Auto sign in after signup (bypass email confirmation for dev)
      try {
        await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } catch (signInError) {
        console.warn('Auto sign-in after signup:', signInError);
      }
    }

    return { user: data.user, userProfile, error: null };
  } catch (error: any) {
    return { user: null, userProfile: null, error: error.message };
  }
};

// Sign In Function
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Fetch user profile from users table
    let userProfile = null;
    if (data.user) {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 = no rows found (OK if users table doesn't exist or user not in table)
          console.warn('Profile fetch warning:', profileError);
        } else if (!profileError) {
          userProfile = profile;
        }
      } catch (profileError) {
        console.warn('Could not fetch profile:', profileError);
      }
    }

    return { user: data.user, userProfile, session: data.session, error: null };
  } catch (error: any) {
    return { user: null, userProfile: null, session: null, error: error.message };
  }
};

// Sign Out Function
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Get Current User
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};
