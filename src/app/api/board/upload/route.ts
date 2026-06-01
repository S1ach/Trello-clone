import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists inside public
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (err) {
      // Ignore if folder exists
    }

    // Create unique filename
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const filePath = join(uploadsDir, uniqueFilename);

    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      file: {
        id: uuidv4(),
        name: file.name,
        url: fileUrl,
        type: file.type,
        size: file.size,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Failed to upload file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
