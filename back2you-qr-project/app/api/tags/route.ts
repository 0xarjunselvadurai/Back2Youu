import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { Tag } from '../../../lib/tags';

export async function GET(request) {
  const tags = await db.tag.findMany();
  return NextResponse.json(tags);
}

export async function POST(request) {
  const { qr_id, tag_number, user_id } = await request.json();
  
  if (!qr_id || !tag_number || !user_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newTag = await db.tag.create({
    data: {
      qr_id,
      tag_number,
      user_id,
      tag_activate: false,
    },
  });

  return NextResponse.json(newTag, { status: 201 });
}