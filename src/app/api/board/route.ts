import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { ChecklistItem, Attachment, Priority } from '@/entities/board/model/types';

// Ensure a default board exists
async function getOrCreateBoard() {
  let board = await prisma.board.findFirst({
    include: {
      columns: {
        include: {
          cards: true,
        },
      },
    },
  });

  if (!board) {
    board = await prisma.board.create({
      data: {
        title: 'Trello Clone',
        columnOrder: [],
      },
      include: {
        columns: {
          include: {
            cards: true,
          },
        },
      },
    });
  }

  return board;
}

// GET /api/board — load board state
export async function GET() {
  try {
    const board = await getOrCreateBoard();

    // Transform to Redux-compatible format
    const columns: Record<string, { id: string; title: string; cardIds: string[]; sortBy: any }> = {};
    const cards: Record<string, { id: string; content: string; description: string; labels: string[]; dueDate: string | null; checklist: ChecklistItem[]; priority: Priority; attachments: Attachment[]; createdAt: string }> = {};

    for (const column of board.columns) {
      columns[column.id] = {
        id: column.id,
        title: column.title,
        cardIds: column.cardIds,
        sortBy: (column as any).sortBy ?? 'none',
      };

      for (const card of column.cards) {
        cards[card.id] = {
          id: card.id,
          content: card.content,
          description: card.description ?? '',
          labels: card.labels ?? [],
          dueDate: card.dueDate ? card.dueDate.toISOString() : null,
          checklist: (card.checklist as any as ChecklistItem[]) ?? [],
          priority: (card.priority as Priority) ?? null,
          attachments: (card.attachments as any as Attachment[]) ?? [],
          createdAt: card.createdAt.toISOString(),
        };
      }
    }

    return NextResponse.json({
      title: board.title,
      searchQuery: '',
      columns,
      cards,
      columnOrder: board.columnOrder,
    });
  } catch (error) {
    console.error('Failed to load board:', error);
    return NextResponse.json({ error: 'Failed to load board' }, { status: 500 });
  }
}

// PATCH /api/board — update board title or column order
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const board = await getOrCreateBoard();

    const data: { title?: string; columnOrder?: string[] } = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.columnOrder !== undefined) data.columnOrder = body.columnOrder;

    await prisma.board.update({
      where: { id: board.id },
      data,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update board:', error);
    return NextResponse.json({ error: 'Failed to update board' }, { status: 500 });
  }
}
