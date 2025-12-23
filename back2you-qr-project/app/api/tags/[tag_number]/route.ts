import { NextResponse } from 'next/server';
import { getTagByNumber } from '@/lib/tags';

export async function GET(request, { params }) {
  const { tag_number } = params;

  try {
    const tag = await getTagByNumber(tag_number);

    if (!tag) {
      return NextResponse.json({ message: 'Tag not found' }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}