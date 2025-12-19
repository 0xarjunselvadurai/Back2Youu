import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail } = body;

    console.log('=== GET USER ITEMS DEBUG ===');
    console.log('Received userEmail:', userEmail);

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: 'Service role key not configured' },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl || '', serviceRoleKey);

    // First, find the user by email
    const { data: userProfile, error: userError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, user_email, user_fname, user_lname')
      .eq('user_email', userEmail)
      .single();

    console.log('User found:', userProfile, 'Error:', userError);

    if (userError || !userProfile) {
      console.error('User not found:', userEmail);
      return NextResponse.json(
        { error: 'User not found with this email' },
        { status: 404 }
      );
    }

    // Get all items for this user
    const { data: items, error: itemsError } = await supabaseAdmin
      .from('items')
      .select('user_id, tag_id, tag_category, tag_description, created_at')
      .eq('user_id', userProfile.user_id)
      .order('created_at', { ascending: false });

    console.log('Items found:', items, 'Error:', itemsError);

    if (itemsError) {
      console.error('Error fetching items:', itemsError);
      return NextResponse.json(
        { error: 'Failed to fetch items', details: itemsError },
        { status: 500 }
      );
    }

    console.log('Successfully retrieved', items?.length || 0, 'items for user:', userEmail);

    return NextResponse.json(
      {
        success: true,
        message: 'Items retrieved successfully',
        user: userProfile,
        items: items || [],
        totalItems: items?.length || 0
      },
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
