import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// POST /api/board/columns — create a column
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title } = body;

    const board = await prisma.board.findFirst();
    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }

    await prisma.column.create({
      data: {
        id,
        title,
        cardIds: [],
        boardId: board.id,
      },
    });

    // Add column to board's columnOrder
    await prisma.board.update({
      where: { id: board.id },
      data: {
        columnOrder: [...board.columnOrder, id],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to create column:', error);
    return NextResponse.json({ error: 'Failed to create column' }, { status: 500 });
  }
}

// DELETE /api/board/columns — delete a column
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { columnId } = body;

    const board = await prisma.board.findFirst();
    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }

    // Delete the column (cards cascade delete via schema)
    await prisma.column.delete({
      where: { id: columnId },
    });

    // Remove from board's columnOrder
    await prisma.board.update({
      where: { id: board.id },
      data: {
        columnOrder: board.columnOrder.filter((id) => id !== columnId),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete column:', error);
    return NextResponse.json({ error: 'Failed to delete column' }, { status: 500 });
  }
}
