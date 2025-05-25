# NextAuth Integration

This project uses NextAuth.js for authentication. Here's what was implemented:

## Configuration

- **NextAuth Route Handler**: Implemented in `app/api/auth/[...nextauth]/route.ts`
- **Middleware**: Updated to protect routes with NextAuth JWT checks
- **Types**: Added TypeScript declarations in `types/next-auth.d.ts`

## Key Features

- **JWT-based Authentication**: Uses JWT tokens for authentication
- **Route Protection**: Only authenticated users can access the dashboard
- **Credential Provider**: Login with email/password
- **Session Management**: Sessions without expiry
- **Role-based Authorization**: Support for admin, editor, and user roles

## Environment Variables

Make sure to set these environment variables:
- `NEXTAUTH_URL`: The base URL of your site (e.g., http://localhost:3000)
- `NEXTAUTH_SECRET`: Secret key used to encrypt JWTs

## Components

- **NextAuthProvider**: Provider component in `app/providers.tsx`
- **LogoutButton**: Reusable logout button in `components/logout-button.tsx`
- **NavUser**: User navigation dropdown in `components/nav-user.tsx`

## Usage

- To check if a user is authenticated, use the `useSession` hook from next-auth/react
- To get the current user, access `session.user` from the session
- To check user roles, use the `hasRole` utility function from `lib/utils.ts`
- For login, redirect to `/login`
- For logout, use the `signOut` function from next-auth/react 