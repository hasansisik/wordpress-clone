import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

// Path to the hero.json file
const heroFilePath = path.join(process.cwd(), 'data', 'hero.json');

export async function GET() {
  try {
    // Add a small delay to ensure file system has time to update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Read the hero data from the file
    const data = await fs.readFile(heroFilePath, 'utf8');
    const heroData = JSON.parse(data);
    
    return NextResponse.json(heroData, { status: 200 });
  } catch (error) {
    console.error('Error reading hero data:', error);
    return NextResponse.json({ error: 'Failed to fetch hero data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Parse the incoming request body
    const body = await request.json();
    
    // Validate the incoming data
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    // Write the updated data to the hero.json file
    await fs.writeFile(heroFilePath, JSON.stringify(body, null, 2), 'utf8');
    
    // Add a small delay to ensure file system has time to update
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return NextResponse.json({ success: true, message: 'Hero data updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating hero data:', error);
    return NextResponse.json({ error: 'Failed to update hero data' }, { status: 500 });
  }
} 