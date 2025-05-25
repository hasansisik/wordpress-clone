import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-muted/50 p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-2">Not Authenticated</h2>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
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
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold">Profile Information</h1>
          </div>
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0 h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center text-3xl font-bold text-primary">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-6">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
                <div className="mt-2">
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                    user.role === 'editor' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Account Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="mb-2">
                    <span className="text-gray-500 text-sm">Member since:</span>
                    <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Permissions:</span>
                    <p className="capitalize">{user.role} privileges</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Security</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="mb-4">
                    <span className="text-gray-500 text-sm">Password:</span>
                    <p>••••••••</p>
                  </div>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium">
                    Change password
                  </button>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6 flex justify-between items-center">
              <button className="bg-primary text-white px-4 py-2 rounded-md">
                Edit Profile
              </button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 