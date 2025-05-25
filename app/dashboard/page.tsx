import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { getCurrentUser } from "@/lib/auth"
import Link from "next/link"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-muted/50 p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-2">Not Authenticated</h2>
          <p>Please log in to view the dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-xl font-bold text-primary">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-6">
              <h2 className="text-xl font-semibold">Welcome, {user.name}!</h2>
              <p className="text-gray-500">
                You are logged in as: <span className="capitalize">{user.role}</span>
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link href="/dashboard/profile" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">View Profile</h4>
                  <p className="text-sm text-gray-500">Manage your account</p>
                </div>
              </div>
            </Link>

            {(user.role === 'admin' || user.role === 'editor') && (
              <Link href="/dashboard/posts" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Manage Posts</h4>
                    <p className="text-sm text-gray-500">Create and edit content</p>
                  </div>
                </div>
              </Link>
            )}

            {user.role === 'admin' && (
              <Link href="/dashboard/users" className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Manage Users</h4>
                    <p className="text-sm text-gray-500">Add, edit or remove users</p>
                  </div>
                </div>
              </Link>
            )}
          </div>

          <h3 className="text-lg font-semibold mb-4">Activity Overview</h3>
          <div className="bg-gray-50 p-6 rounded-lg">
            {user.role === 'admin' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-500 mb-2">Total Users</h4>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-500 mb-2">Total Posts</h4>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-500 mb-2">New Comments</h4>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            ) : user.role === 'editor' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-500 mb-2">Your Posts</h4>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-500 mb-2">Comments on Your Posts</h4>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-center text-gray-500">Welcome to your personal dashboard.</p>
                <p className="text-center">You can view and update your profile information.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
