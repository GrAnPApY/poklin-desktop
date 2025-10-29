# Authentication System Setup - Complete Guide

## ✅ What Has Been Done

### 1. **Project Structure Corrected**

The file structure has been reorganized to follow Next.js best practices:

```
src/
├── app/                              # Next.js App Router
│   ├── api/                          # API Routes
│   │   └── auth/
│   │       ├── [...nextauth]/
│   │       │   └── route.ts         # NextAuth API handler
│   │       └── register/
│   │           └── route.ts         # User registration endpoint
│   │
│   ├── auth/                         # Authentication pages
│   │   ├── login/
│   │   │   └── page.tsx             # Login page
│   │   └── register/
│   │       └── page.tsx             # Registration page
│   │
│   ├── dashboard/
│   │   └── page.tsx                 # Protected dashboard
│   │
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Home page
│   └── globals.css                  # Global styles
│
├── components/                      # Reusable React components
│   ├── Providers.tsx                # Session provider wrapper
│   └── SignOutButton.tsx            # Sign out button component
│
├── lib/                             # Utilities and configurations
│   ├── auth.ts                      # NextAuth configuration
│   ├── prisma.ts                    # Prisma client singleton
│   └── validations/
│       └── auth.ts                  # Zod validation schemas
│
├── types/                           # TypeScript type definitions
│   └── next-auth.d.ts              # NextAuth type extensions
│
└── middleware.ts                    # Route protection middleware
```

### 2. **Authentication Features Implemented**

- ✅ User registration with email/password
- ✅ Login with email/password
- ✅ Protected dashboard page
- ✅ User profile display (name, age, email)
- ✅ Sign out functionality
- ✅ Google OAuth (configured, needs credentials)
- ✅ Apple OAuth (ready to enable)
- ✅ Form validation with Zod
- ✅ Password hashing with bcrypt
- ✅ JWT session management
- ✅ Middleware protection for routes

### 3. **Database Schema Created**

User model includes:
- `id` - Unique identifier
- `name` - User's full name
- `age` - User's age
- `email` - Email address (unique)
- `password` - Hashed password
- `emailVerified` - Email verification timestamp
- `image` - Profile image URL
- NextAuth tables (Account, Session, VerificationToken)

---

## 🚀 Next Steps to Complete Setup

### Step 1: Install Required Dependencies

```bash
# Install authentication packages
npm install next-auth @next-auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs

# Generate Prisma client
npx prisma generate
```

### Step 2: Set Up Database

You need to create a `.env` file with your database connection:

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/poklin_db"
# or for SQLite (development):
# DATABASE_URL="file:./dev.db"

# NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional for now)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Apple OAuth (optional for now)
APPLE_CLIENT_ID=""
APPLE_CLIENT_SECRET=""
```

**Generate your NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 3: Initialize Database

```bash
# Reset and create database schema
npx prisma migrate reset

# Or if you prefer migrations
npx prisma migrate dev --name init
```

### Step 4: Test the Authentication

1. **Start the dev server** (already running):
   ```bash
   npm run dev
   ```

2. **Register a new user**:
   - Visit: http://localhost:3000/auth/register
   - Fill in: Name, Age, Email, Password
   - Click "Create account"

3. **Login**:
   - Visit: http://localhost:3000/auth/login
   - Enter your email and password
   - Click "Sign in"

4. **Access Dashboard**:
   - After login, you'll be redirected to http://localhost:3000/dashboard
   - View your profile information
   - Test the "Sign out" button

---

## 🔐 Adding Google Sign In (Optional)

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Authorized JavaScript origins: `http://localhost:3000`
7. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
8. Copy the Client ID and Client Secret

### 2. Add to .env

```bash
GOOGLE_CLIENT_ID="your-client-id-here"
GOOGLE_CLIENT_SECRET="your-client-secret-here"
```

### 3. Test Google Sign In

- Visit http://localhost:3000/auth/login
- Click the "Google" button
- Complete OAuth flow

---

## 🍎 Adding Apple Sign In (Optional)

### 1. Get Apple OAuth Credentials

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Create an App ID
3. Enable "Sign in with Apple"
4. Create a Service ID
5. Configure domains and redirect URLs
6. Generate a private key

### 2. Add to .env

```bash
APPLE_CLIENT_ID="your-service-id"
APPLE_CLIENT_SECRET="your-generated-secret"
```

### 3. Uncomment Apple Provider

In `src/lib/auth.ts`, uncomment:
```typescript
import AppleProvider from 'next-auth/providers/apple';

// In providers array:
AppleProvider({
  clientId: process.env.APPLE_CLIENT_ID || '',
  clientSecret: process.env.APPLE_CLIENT_SECRET || '',
}),
```

---

## 🛡️ Protected Routes

Routes automatically protected by middleware:
- `/dashboard/*` - All dashboard pages
- `/api/protected/*` - Protected API routes

To protect additional routes, edit `src/middleware.ts`:
```typescript
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/protected/:path*',
    '/profile/:path*',  // Add more protected routes
  ],
};
```

---

## 📝 Common Tasks

### Create a New User Programmatically

```typescript
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const hashedPassword = await bcrypt.hash('password123', 10);

const user = await prisma.user.create({
  data: {
    name: 'John Doe',
    age: 25,
    email: 'john@example.com',
    password: hashedPassword,
  },
});
```

### Check Authentication in a Server Component

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function MyPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return <div>Please sign in</div>;
  }
  
  return <div>Hello {session.user?.name}</div>;
}
```

### Check Authentication in a Client Component

```typescript
'use client';

import { useSession } from 'next-auth/react';

export default function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') return <div>Please sign in</div>;
  
  return <div>Hello {session?.user?.name}</div>;
}
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@/lib/auth'"

**Solution**: The TypeScript server might need to restart. In VS Code:
- Cmd+Shift+P → "TypeScript: Restart TS Server"

### Issue: Database connection errors

**Solution**: Verify your DATABASE_URL in .env is correct and the database is running.

### Issue: NextAuth secret error

**Solution**: Make sure NEXTAUTH_SECRET is set in .env:
```bash
openssl rand -base64 32
```

### Issue: Google OAuth not working

**Solution**: 
1. Verify redirect URI is exactly: `http://localhost:3000/api/auth/callback/google`
2. Make sure Google Cloud Console project has OAuth consent screen configured

---

## 🎯 What's Working Now

✅ File structure is correct  
✅ Authentication system is fully configured  
✅ Login/Register pages are ready  
✅ Dashboard is protected  
✅ Middleware is protecting routes  
✅ TypeScript paths are configured  
✅ Google OAuth is ready (needs credentials)  
✅ Apple OAuth is ready (needs setup)  

---

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Created**: $(date)
**Status**: ✅ Structure Corrected & Ready for Testing

