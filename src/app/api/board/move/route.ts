import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// POST /api/board/move — move card between columns
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sourceColumnId, destinationColumnId, sourceIndex, destinationIndex, cardId } = body;

    // Get source and destination columns
    const sourceColumn = await prisma.column.findUnique({ where: { id: sourceColumnId } });
    const destColumn = sourceColumnId === destinationColumnId
      ? sourceColumn
      : await prisma.column.findUnique({ where: { id: destinationColumnId } });

    if (!sourceColumn || !destColumn) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 });
    }

    // Update source column cardIds
    const newSourceCardIds = [...sourceColumn.cardIds];
    newSourceCardIds.splice(sourceIndex, 1);

    if (sourceColumnId === destinationColumnId) {
      // Moving within same column
      newSourceCardIds.splice(destinationIndex, 0, cardId);
      await prisma.column.update({
        where: { id: sourceColumnId },
        data: { cardIds: newSourceCardIds },
      });
    } else {
      // Moving to different column
      const newDestCardIds = [...destColumn.cardIds];
      newDestCardIds.splice(destinationIndex, 0, cardId);

      // Update card's column reference
      await prisma.card.update({
        where: { id: cardId },
        data: { columnId: destinationColumnId },
      });

      await prisma.column.update({
        where: { id: sourceColumnId },
        data: { cardIds: newSourceCardIds },
      });

      await prisma.column.update({
        where: { id: destinationColumnId },
        data: { cardIds: newDestCardIds },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to move card:', error);
    return NextResponse.json({ error: 'Failed to move card' }, { status: 500 });
  }
}
