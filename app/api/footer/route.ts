import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

// Path to the footer.json file
const footerFilePath = path.join(process.cwd(), 'data', 'footer.json');

export async function GET() {
  try {
    // Add a small delay to ensure file system has time to update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Read the footer data from the file
    const data = await fs.readFile(footerFilePath, 'utf8');
    const footerData = JSON.parse(data);
    
    return NextResponse.json(footerData, { status: 200 });
  } catch (error) {
    console.error('Error reading footer data:', error);
    return NextResponse.json({ error: 'Failed to fetch footer data' }, { status: 500 });
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
    
    // Write the updated data to the footer.json file
    await fs.writeFile(footerFilePath, JSON.stringify(body, null, 2), 'utf8');
    
    // Add a small delay to ensure file system has time to update
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return NextResponse.json({ success: true, message: 'Footer data updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating footer data:', error);
    return NextResponse.json({ error: 'Failed to update footer data' }, { status: 500 });
  }
} 