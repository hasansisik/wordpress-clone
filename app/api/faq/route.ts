import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// GET handler to retrieve FAQ data
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'faq.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileData);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading FAQ data:', error);
    return NextResponse.json({ error: 'Failed to read FAQ data' }, { status: 500 });
  }
}

// POST handler to save FAQ data
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const filePath = path.join(process.cwd(), 'data', 'faq.json');
    
    // Save the updated data to the file
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving FAQ data:', error);
    return NextResponse.json({ error: 'Failed to save FAQ data' }, { status: 500 });
  }
} 