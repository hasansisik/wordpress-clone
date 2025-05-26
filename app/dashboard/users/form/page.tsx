"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Eye,
  Loader2,
  Mail,
  Phone,
  User,
  CalendarClock,
  Heading1
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface FormSubmission {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  createdAt: string
}

export default function ContactFormSubmissions() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('/api/contact-form')
        if (!response.ok) throw new Error('Failed to fetch submissions')
        const data = await response.json()
        setSubmissions(data)
      } catch (error) {
        console.error('Error fetching form submissions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

  const viewMessage = (submission: FormSubmission) => {
    setSelectedSubmission(submission)
    setDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center border-b">
        <div className="flex items-center gap-2 px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push('/dashboard/users')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Separator
            orientation="vertical"
            className="mx-4 h-6"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/users">Users</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Contact Forms</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Contact Form Submissions</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : submissions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <Mail className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">No form submissions yet</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Submissions</CardTitle>
              <CardDescription>
                You have {submissions.length} contact form {submissions.length === 1 ? 'submission' : 'submissions'} in total.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>{submission.phone || "—"}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate" title={submission.subject}>
                          {submission.subject}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(submission.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => viewMessage(submission)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              View the complete message from {selectedSubmission?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-[24px_1fr] items-start gap-4">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="text-sm font-semibold">Name</h4>
                  <p>{selectedSubmission.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-[24px_1fr] items-start gap-4">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="text-sm font-semibold">Email</h4>
                  <p>{selectedSubmission.email}</p>
                </div>
              </div>

              {selectedSubmission.phone && (
                <div className="grid grid-cols-[24px_1fr] items-start gap-4">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="text-sm font-semibold">Phone</h4>
                    <p>{selectedSubmission.phone}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-[24px_1fr] items-start gap-4">
                <Heading1 className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="text-sm font-semibold">Subject</h4>
                  <p>{selectedSubmission.subject}</p>
                </div>
              </div>

              <div className="grid grid-cols-[24px_1fr] items-start gap-4">
                <CalendarClock className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="text-sm font-semibold">Date</h4>
                  <p>{formatDate(selectedSubmission.createdAt)}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold mb-2">Message</h4>
                <Card>
                  <CardContent className="p-4 whitespace-pre-wrap">
                    {selectedSubmission.message}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              onClick={() => setDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 