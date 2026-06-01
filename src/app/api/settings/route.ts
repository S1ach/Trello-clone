import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// GET /api/settings — load settings
export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: 'default',
          backgroundId: 'ocean',
          customImage: null,
          locale: 'ru',
        },
      });
    }

    return NextResponse.json({
      backgroundId: settings.backgroundId,
      customImage: settings.customImage,
      locale: settings.locale ?? 'ru',
    });
  } catch (error) {
    console.error('Failed to load settings:', error);
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

// PUT /api/settings — save settings
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    await prisma.settings.upsert({
      where: { id: 'default' },
      update: {
        backgroundId: body.backgroundId,
        customImage: body.customImage ?? null,
        locale: body.locale ?? 'ru',
      },
      create: {
        id: 'default',
        backgroundId: body.backgroundId,
        customImage: body.customImage ?? null,
        locale: body.locale ?? 'ru',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
