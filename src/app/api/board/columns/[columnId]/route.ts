import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// PATCH /api/board/columns/[columnId] — update column (title, cardIds)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ columnId: string }> }
) {
  try {
    const { columnId } = await params;
    const body = await request.json();

    const data: { title?: string; cardIds?: string[] } = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.cardIds !== undefined) data.cardIds = body.cardIds;

    await prisma.column.update({
      where: { id: columnId },
      data,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update column:', error);
    return NextResponse.json({ error: 'Failed to update column' }, { status: 500 });
  }
}
