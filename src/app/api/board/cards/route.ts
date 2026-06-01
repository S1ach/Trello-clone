import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// POST /api/board/cards — create a card
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, content, columnId, createdAt, description, labels, dueDate, checklist, priority, attachments } = body;

    // Create the card
    await prisma.card.create({
      data: {
        id,
        content,
        description: description ?? '',
        labels: labels ?? [],
        dueDate: dueDate ? new Date(dueDate) : null,
        checklist: checklist ?? [],
        priority: priority ?? null,
        attachments: attachments ?? [],
        columnId,
        createdAt: createdAt ? new Date(createdAt) : new Date(),
      },
    });

    // Add card to column's cardIds
    const column = await prisma.column.findUnique({ where: { id: columnId } });
    if (column) {
      await prisma.column.update({
        where: { id: columnId },
        data: {
          cardIds: [...column.cardIds, id],
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to create card:', error);
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}

// PATCH /api/board/cards — update card fields
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const data: Record<string, any> = {};
    if (updates.content !== undefined) data.content = updates.content;
    if (updates.description !== undefined) data.description = updates.description;
    if (updates.labels !== undefined) data.labels = updates.labels;
    if (updates.dueDate !== undefined) data.dueDate = updates.dueDate ? new Date(updates.dueDate) : null;
    if (updates.checklist !== undefined) data.checklist = updates.checklist;
    if (updates.priority !== undefined) data.priority = updates.priority;
    if (updates.attachments !== undefined) data.attachments = updates.attachments;

    await prisma.card.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update card:', error);
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
  }
}

// DELETE /api/board/cards — delete a card
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { cardId, columnId } = body;

    // Delete the card
    await prisma.card.delete({
      where: { id: cardId },
    });

    // Remove from column's cardIds
    const column = await prisma.column.findUnique({ where: { id: columnId } });
    if (column) {
      await prisma.column.update({
        where: { id: columnId },
        data: {
          cardIds: column.cardIds.filter((id) => id !== cardId),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete card:', error);
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}
