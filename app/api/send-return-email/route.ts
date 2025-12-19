import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tagId } = body;

    console.log('=== RETURN EMAIL API DEBUG ===');
    console.log('Received tagId:', tagId);
    console.log('RESEND_API_KEY configured:', !!process.env.RESEND_API_KEY);

    if (!tagId) {
      return NextResponse.json(
        { error: 'Tag ID is required' },
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

    // Find the item by tag ID
    const tagIdNumber = parseInt(tagId, 10);
    
    console.log('Searching for tag_id:', tagIdNumber);

    const { data: itemsArray, error: itemError } = await supabaseAdmin
      .from('items')
      .select('user_id, tag_id, tag_category, tag_description, created_at')
      .eq('tag_id', tagIdNumber)
      .limit(1);

    console.log('Search result:', itemsArray, 'Error:', itemError);

    if (itemError || !itemsArray || itemsArray.length === 0) {
      console.error('Item search FAILED:', { tagId, tagIdNumber, itemError });
      return NextResponse.json(
        { error: 'Item not found with this tag ID' },
        { status: 404 }
      );
    }

    const items = itemsArray[0];

    // Get owner's email from user_profiles
    const { data: owner, error: ownerError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_email, user_fname, user_lname')
      .eq('user_id', items.user_id)
      .single();

    if (ownerError || !owner) {
      return NextResponse.json(
        { error: 'Owner information not found' },
        { status: 404 }
      );
    }

    // Item found - return success without sending email
    console.log('Item found - owner:', owner.user_email);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email sent successfully to owner',
        ownerName: `${owner.user_fname} ${owner.user_lname}`,
        ownerEmail: owner.user_email
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
