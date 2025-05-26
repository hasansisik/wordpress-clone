import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'

// Define the storage file path
const dataFilePath = path.join(process.cwd(), 'data', 'contact-submissions.json')

// Ensure the data directory exists
const ensureDirectoryExists = () => {
  const dir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  
  // Create empty array file if it doesn't exist
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]), 'utf8')
  }
}

// Function to read submissions
const getSubmissions = () => {
  ensureDirectoryExists()
  try {
    const fileContent = fs.readFileSync(dataFilePath, 'utf8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Error reading submissions file:', error)
    return []
  }
}

// Function to save submissions
const saveSubmission = (submission: any) => {
  ensureDirectoryExists()
  try {
    const submissions = getSubmissions()
    submissions.push(submission)
    fs.writeFileSync(dataFilePath, JSON.stringify(submissions, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Error saving submission:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: 'Name and email are required fields' },
        { status: 400 }
      )
    }
    
    const submission = {
      id: uuidv4(),
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      subject: data.subject || '',
      message: data.message || '',
      createdAt: new Date().toISOString()
    }
    
    const success = saveSubmission(submission)
    
    if (success) {
      return NextResponse.json(
        { message: 'Form submitted successfully', id: submission.id },
        { status: 201 }
      )
    } else {
      return NextResponse.json(
        { error: 'Failed to save submission' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error processing form submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const submissions = getSubmissions()
    return NextResponse.json(submissions)
  } catch (error) {
    console.error('Error retrieving submissions:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve submissions' },
      { status: 500 }
    )
  }
} 