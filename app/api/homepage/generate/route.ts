import { NextResponse } from 'next/server';
import { promises as fsPromises } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate the incoming data structure
    if (!data.sections || !Array.isArray(data.sections)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    
    // Generate and update the actual page file
    await updateHomePage(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error generating homepage:', error);
    return NextResponse.json({ error: 'Failed to generate homepage' }, { status: 500 });
  }
}

// Function to update the actual home page file
async function updateHomePage(data: any) {
  try {
    // Create imports
    let imports = ``;
    
    // Add imports for sections
    const usedSections = new Set();
    data.sections.forEach((section: any) => {
      usedSections.add(section.type);
    });
    
    // Add each import only once
    Array.from(usedSections).forEach((type: string) => {
      imports += `import ${type} from "@/components/sections/${type}"\n`;
    });
    
    // Create sections JSX
    let sectionsJSX = data.sections.map((section: any) => {
      return `\t\t<${section.type} />`;
    }).join('\n');
    
    // Create the full page code
    const pageCode = `${imports}
export default function Home() {
\treturn (
\t\t<>
${sectionsJSX}
\t\t</>
\t)
}`;

    // Write to the home page file
    const pageFilePath = path.join(process.cwd(), 'app', '(logged-out)', 'page.tsx');
    await fsPromises.writeFile(pageFilePath, pageCode);
    
    return true;
  } catch (error) {
    console.error('Error updating home page file:', error);
    return false;
  }
} 