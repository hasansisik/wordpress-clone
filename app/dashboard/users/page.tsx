'use client';

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
import { useEffect, useState } from "react";
import { User, UserRole } from "@/lib/types";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Form states
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Fetch users
  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/users');
        
        if (!response.ok) {
          if (response.status === 403) {
            setIsAdmin(false);
            setError("You don't have permission to view this page");
            return;
          }
          throw new Error("Failed to fetch users");
        }
        
        const data = await response.json();
        setUsers(data.users || []);
        setIsAdmin(true);
      } catch (err) {
        setError("Error loading users. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUsers();
  }, []);

  // Add new user handler
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setFormError(data.message || "Failed to add user");
        return;
      }
      
      // Add new user to the list
      setUsers(prev => [...prev, data.user]);
      setFormSuccess("User added successfully");
      
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
      setShowAddUserForm(false);
    } catch (err) {
      setFormError("An error occurred. Please try again.");
      console.error(err);
    }
  };

  // Change password handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    
    if (!selectedUser) {
      setFormError("No user selected");
      return;
    }
    
    if (newPassword.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }
    
    try {
      const response = await fetch(`/api/users/${selectedUser.id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setFormError(data.message || "Failed to change password");
        return;
      }
      
      setFormSuccess("Password changed successfully");
      
      // Reset form
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePasswordForm(false);
      setSelectedUser(null);
    } catch (err) {
      setFormError("An error occurred. Please try again.");
      console.error(err);
    }
  };

  // Delete user handler
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to delete user");
        return;
      }
      
      // Remove deleted user from the list
      setUsers(prev => prev.filter(user => user.id !== userId));
      setFormSuccess("User deleted successfully");
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    }
  };

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
                <BreadcrumbPage>Users</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="loader"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-8 rounded-xl text-center">
            <h2 className="text-2xl font-bold mb-2 text-red-800">Error</h2>
            <p className="text-red-700">{error}</p>
          </div>
        ) : !isAdmin ? (
          <div className="bg-muted/50 p-8 rounded-xl text-center">
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p>Only administrators can view and manage users.</p>
          </div>
        ) : (
          <>
            {formSuccess && (
              <div className="bg-green-50 p-4 rounded-xl mb-4">
                <p className="text-green-700">{formSuccess}</p>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">User Management</h1>
              <button 
                className="bg-primary text-white px-4 py-2 rounded-md"
                onClick={() => {
                  setShowAddUserForm(true);
                  setShowChangePasswordForm(false);
                  setFormError(null);
                  setFormSuccess(null);
                }}
              >
                Add New User
              </button>
            </div>
            
            {/* Add User Form */}
            {showAddUserForm && (
              <div className="bg-white rounded-xl shadow overflow-hidden mb-4">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-bold">Add New User</h2>
                  <button 
                    className="text-gray-500"
                    onClick={() => setShowAddUserForm(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="p-6">
                  {formError && (
                    <div className="bg-red-50 p-4 rounded-xl mb-4">
                      <p className="text-red-700">{formError}</p>
                    </div>
                  )}
                  <form onSubmit={handleAddUser}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={role}
                          onChange={(e) => setRole(e.target.value as UserRole)}
                          required
                        >
                          <option value="user">User</option>
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md mr-2"
                        onClick={() => setShowAddUserForm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-md"
                      >
                        Add User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* Change Password Form */}
            {showChangePasswordForm && selectedUser && (
              <div className="bg-white rounded-xl shadow overflow-hidden mb-4">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-bold">Change Password for {selectedUser.name}</h2>
                  <button 
                    className="text-gray-500"
                    onClick={() => {
                      setShowChangePasswordForm(false);
                      setSelectedUser(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div className="p-6">
                  {formError && (
                    <div className="bg-red-50 p-4 rounded-xl mb-4">
                      <p className="text-red-700">{formError}</p>
                    </div>
                  )}
                  <form onSubmit={handleChangePassword}>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md mr-2"
                        onClick={() => {
                          setShowChangePasswordForm(false);
                          setSelectedUser(null);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-md"
                      >
                        Change Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* Users Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                          user.role === 'editor' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                        <button 
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowChangePasswordForm(true);
                            setShowAddUserForm(false);
                            setFormError(null);
                            setFormSuccess(null);
                          }}
                        >
                          Change Password
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
        </div>
          </>
        )}
      </div>
    </>
  );
}
