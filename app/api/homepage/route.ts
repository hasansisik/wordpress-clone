import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

// File path for homepage data
const dataFilePath = path.join(process.cwd(), 'data', 'homepage.json');

// Ensure data directory exists
const ensureDirectoryExists = async () => {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fsPromises.access(dataDir);
  } catch (error) {
    await fsPromises.mkdir(dataDir, { recursive: true });
  }
};

// Default homepage data
const defaultData = {
  sections: [
    {
      id: "hero1-default",
      name: "Hero 1",
      type: "Hero1"
    },
    {
      id: "cta4-default",
      name: "CTA 4",
      type: "Cta4"
    },
    {
      id: "faqs2-default",
      name: "FAQs 2",
      type: "Faqs2"
    },
    {
      id: "features1-default",
      name: "Features 1",
      type: "Features1"
    },
    {
      id: "features2-default",
      name: "Features 2",
      type: "Features2"
    },
    {
      id: "features3-default",
      name: "Features 3",
      type: "Features3"
    },
    {
      id: "services2-default",
      name: "Services 2",
      type: "Services2"
    }
  ],
  headerStyle: 1,
  footerStyle: 1
};

// GET handler for fetching homepage data
export async function GET() {
  try {
    await ensureDirectoryExists();
    
    try {
      // Try to read the existing file
      const fileContent = await fsPromises.readFile(dataFilePath, 'utf-8');
      return NextResponse.json(JSON.parse(fileContent));
    } catch (error) {
      // If file doesn't exist or is invalid, create it with default data
      await fsPromises.writeFile(dataFilePath, JSON.stringify(defaultData, null, 2));
      return NextResponse.json(defaultData);
    }
  } catch (error) {
    console.error('Error reading homepage data:', error);
    return NextResponse.json({ error: 'Failed to fetch homepage data' }, { status: 500 });
  }
}

// POST handler for saving homepage data
export async function POST(request: Request) {
  try {
    await ensureDirectoryExists();
    
    const data = await request.json();
    
    // Validate the incoming data structure
    if (!data.sections || !Array.isArray(data.sections)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    
    // Write the updated data to the file
    await fsPromises.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    
    // Generate and update the actual page file
    await updateHomePage(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving homepage data:', error);
    return NextResponse.json({ error: 'Failed to save homepage data' }, { status: 500 });
  }
}

// Function to update the actual home page file
async function updateHomePage(data: any) {
  try {
    // Create imports
    let imports = `import Layout from "@/components/layout/Layout"\n`;
    
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
      return `\t\t\t\t<${section.type} />`;
    }).join('\n');
    
    // Create the full page code
    const pageCode = `${imports}
export default function Home() {
\treturn (
\t\t<>
\t\t\t<Layout headerStyle={${data.headerStyle}} footerStyle={${data.footerStyle}}>
${sectionsJSX}
\t\t\t</Layout>
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