import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const dataFilePath = path.join(process.cwd(), 'data', 'other.json');
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error reading other data:', error);
    return NextResponse.json({ error: 'Failed to load other data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const dataFilePath = path.join(process.cwd(), 'data', 'other.json');
    
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating other data:', error);
    return NextResponse.json({ error: 'Failed to update other data' }, { status: 500 });
  }
} 