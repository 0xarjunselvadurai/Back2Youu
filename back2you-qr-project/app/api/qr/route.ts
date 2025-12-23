import { NextResponse } from 'next/server';
import { db } from '../../../lib/db'; // Adjust the import path as necessary

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tagNumber = searchParams.get('tag_number');

  if (!tagNumber) {
    return NextResponse.json({ error: 'Tag number is required' }, { status: 400 });
  }

  try {
    const tag = await db.tag.findUnique({
      where: { tag_number: tagNumber },
    });

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  const { tag_number, user_id, tag_activate } = await request.json();

  if (!tag_number || !user_id) {
    return NextResponse.json({ error: 'Tag number and user ID are required' }, { status: 400 });
  }

  try {
    const newTag = await db.tag.create({
      data: {
        tag_number,
        user_id,
        tag_activate,
      },
    });

    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}