# Coinday Admin Panel Setup

This admin panel allows you to moderate news articles stored in Supabase. Follow these steps to set up and configure the system.

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- Basic knowledge of SQL and environment variables

## Setup Instructions

### 1. Supabase Configuration

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Set up the Database**
   - Go to your Supabase dashboard
   - Navigate to the SQL Editor
   - Copy and paste the contents of `supabase-setup.sql`
   - Run the SQL script to create the `news_articles` table and sample data

3. **Configure Authentication**
   - In your Supabase dashboard, go to Authentication > Settings
   - Enable email authentication
   - Create an admin user account through the Supabase dashboard or Auth UI

### 2. Environment Variables

1. **Update `.env.local`**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **Get your credentials from Supabase**
   - Project URL: Found in Settings > General
   - Anon Key: Found in Settings > API

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm run dev
```

## Admin Panel Features

### Authentication
- **Login Page**: `/admin/login`
- **Protected Routes**: All admin routes require authentication
- **Logout**: Available in the admin navigation

### Article Management

#### Pending Articles (`/admin`)
- View all articles with `approved = false`
- **Approve**: Sets `approved = true`
- **Reject**: Deletes the article
- **Edit**: Opens modal to edit title, summary, and content

#### Approved Articles (`/admin/approved`)
- View all articles with `approved = true`
- **Edit**: Modify approved articles
- **Revert**: Change status back to pending (`approved = false`)

### Edit Modal Features
- Edit rewritten title, summary, and content
- View original title (read-only)
- Save changes without approval
- Save and approve in one action
- Real-time updates

## Database Schema

```sql
CREATE TABLE news_articles (
  id UUID PRIMARY KEY,
  original_title TEXT NOT NULL,
  rewritten_title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT NOT NULL,
  published_date TIMESTAMP WITH TIME ZONE NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Security Features

- **Row Level Security (RLS)**: Enabled on the `news_articles` table
- **Authentication Required**: All admin operations require valid session
- **Server-side Validation**: API routes validate authentication
- **Middleware Protection**: Routes are protected at the middleware level

## API Endpoints

- `PATCH /api/admin/articles/[id]` - Update article
- `DELETE /api/admin/articles/[id]` - Delete article

## Deployment

### Environment Variables for Production
Make sure to set the following environment variables in your deployment platform:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
```

### Recommended Deployment Platforms
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Heroku**

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check that all import paths are correct

2. **Authentication not working**
   - Verify Supabase URL and anon key in `.env.local`
   - Check that the user exists in Supabase Auth
   - Ensure RLS policies are set up correctly

3. **Database connection issues**
   - Verify Supabase project is active
   - Check that the `news_articles` table exists
   - Ensure RLS policies allow authenticated access

4. **Build errors**
   - Check TypeScript errors with `npm run build`
   - Ensure all required environment variables are set

### Getting Help

- Check the browser console for client-side errors
- Check the terminal/server logs for server-side errors
- Verify Supabase dashboard for database and auth issues

## Development Notes

- The admin panel uses the same dark theme as the main Coinday site
- All components are built with Tailwind CSS
- Real-time updates are handled through Supabase's real-time features
- The system is designed to be production-ready with proper error handling

## Sample Data

The setup script includes sample articles for testing. You can:
- Approve/reject pending articles
- Edit article content
- Test the full moderation workflow

Remember to replace sample data with real articles in production.