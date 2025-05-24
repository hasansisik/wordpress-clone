import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'privacy.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading privacy policy:', error);
    return NextResponse.json(
      { error: 'Failed to fetch privacy policy data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate data structure
    if (!data.hero || typeof data.hero.title !== 'string' || typeof data.hero.description !== 'string') {
      return NextResponse.json(
        { error: 'Invalid data format. Hero section must contain title and description.' },
        { status: 400 }
      );
    }
    
    if (typeof data.content !== 'string') {
      return NextResponse.json(
        { error: 'Invalid data format. Content must be a string.' },
        { status: 400 }
      );
    }
    
    const filePath = path.join(process.cwd(), 'data', 'privacy.json');
    
    // Format JSON with indentation for readability
    const formattedData = JSON.stringify(data, null, 2);
    
    // Write data to file
    await fs.writeFile(filePath, formattedData, 'utf8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving privacy policy:', error);
    return NextResponse.json(
      { error: 'Failed to save privacy policy data' },
      { status: 500 }
    );
  }
} 