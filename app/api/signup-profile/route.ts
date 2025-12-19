import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, firstName, lastName } = body;

    if (!userId || !email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use service role key on the backend (never expose to client)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: 'Service role key not configured' },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl || '', serviceRoleKey);

    // Insert profile using service role (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .insert([
        {
          user_id: userId,
          user_email: email,
          user_fname: firstName,
          user_lname: lastName,
        },
      ])
      .select();

    if (error) {
      console.error('Profile insertion error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, profile: data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
