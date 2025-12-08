# Hospital Visitor Parking System

This is a production-grade Next.js application for a hospital visitor parking system. It includes features for buying tickets, viewing active and past tickets, user profiles, an admin dashboard, and a public lookup for active tickets.

## Features

- **New Ticket**: Purchase parking tickets for various durations.
- **My Tickets**: View your active and past tickets with a live countdown.
- **Profile**: Simple email-based authentication and profile management.
- **Admin Dashboard**: View all tickets with pagination and sorting (admin only).
- **Public Lookup**: Check for active parking tickets by car plate.
- **Mobile-First Design**: Responsive and accessible UI using Tailwind CSS and shadcn/ui.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **ORM**: Prisma
- **Database**: PostgreSQL (compatible with Neon, Supabase, etc.)
- **Authentication**: Auth.js (NextAuth) with JWT sessions

## Getting Started

Follow these steps to get the project running locally.

### 1. Install Dependencies

Install the project dependencies using your preferred package manager.

```bash
pnpm install
# or
npm install
# or
yarn install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variables.

```env
# PostgreSQL connection string.
# Example for Neon: postgresql://user:password@ep-ancient-sound-a2abc123.eu-central-1.aws.neon.tech/dbname?sslmode=require
# Example for Supabase: postgresql://postgres:password@db.abcdefghi.supabase.co:5432/postgres
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB"

# A long, random string used to encrypt JWTs and other sensitive data.
# You can generate one here: https://generate-secret.vercel.app/32
NEXTAUTH_SECRET="your-long-random-string"

# The canonical URL of your development environment.
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Run Database Migrations

Apply the database schema to your PostgreSQL database.

```bash
pnpm prisma migrate dev
```

This will create the `User` and `Ticket` tables.

### 4. Run the Development Server

Start the Next.js development server.

```bash
pnpm dev
```

### 5. Open the Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Sign In

- Navigate to the **Profile** page.
- Enter any email address to sign in.
- The **first user to register will automatically become an ADMIN**. All subsequent users will have the `USER` role.

## Deployment

This application is designed for easy deployment on Vercel or any Node.js hosting provider.

### Vercel

1.  **Push to Git**: Push your code to a GitHub, GitLab, or Bitbucket repository.
2.  **Import Project**: Import the repository into your Vercel dashboard.
3.  **Configure Environment Variables**: Add the `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` (your production URL) in the project settings.
4.  **Build Command**: Vercel will automatically detect the Next.js project and use the correct build settings. The `postinstall` script will run `prisma generate` to ensure the Prisma Client is available in the serverless functions.
5.  **Deploy**: Click the "Deploy" button.

### Notes on Database for Serverless

- **Prisma and Serverless**: When deploying to a serverless environment like Vercel, it's important to use a database provider that supports a high number of connections.
- **Neon / Supabase**: Both [Neon](https://neon.tech/) and [Supabase](https://supabase.com/) are excellent choices as they provide connection pooling, which is essential for serverless functions to avoid exhausting database connections.
- **DATABASE_URL**: Ensure your `DATABASE_URL` is configured to use the connection pooler URL if you are using one.
