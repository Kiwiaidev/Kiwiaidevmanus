# AI Website Builder Platform - Deployment Guide

## Overview

This document outlines the steps required to deploy the AI Website Builder Platform to a production environment. It covers environment setup, configuration, build process, and verification steps.

## Prerequisites

Before deploying, ensure you have:

1. A Supabase account with a project set up
2. A GitHub account with access to create repositories
3. A Netlify account with permissions to create sites
4. Access to environment variables for all services
5. Node.js 16+ installed on the deployment machine

## Environment Variables

Create a `.env.production` file with the following variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# GitHub Configuration
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_ACCESS_TOKEN=your-github-access-token

# Netlify Configuration
NETLIFY_CLIENT_ID=your-netlify-client-id
NETLIFY_CLIENT_SECRET=your-netlify-client-secret
NETLIFY_ACCESS_TOKEN=your-netlify-access-token

# AI Service Configuration
AI_API_KEY=your-ai-api-key
AI_API_URL=https://your-ai-api-url

# Application Configuration
NEXTAUTH_URL=https://your-production-domain.com
NEXTAUTH_SECRET=your-nextauth-secret
NODE_ENV=production
```

## Database Setup

1. Create the required tables in your Supabase project:

```sql
-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Components Table
CREATE TABLE components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deployments Table
CREATE TABLE deployments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  site_id TEXT NOT NULL,
  deploy_id TEXT NOT NULL,
  status TEXT NOT NULL,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GitHub Repositories Table
CREATE TABLE github_repositories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  repo_name TEXT NOT NULL,
  repo_url TEXT NOT NULL,
  is_private BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

2. Set up Row Level Security (RLS) policies:

```sql
-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE components ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_repositories ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Users can view their own projects" 
  ON projects FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" 
  ON projects FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
  ON projects FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
  ON projects FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for components
CREATE POLICY "Users can view components of their projects" 
  ON components FOR SELECT 
  USING (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id));

CREATE POLICY "Users can insert components to their projects" 
  ON components FOR INSERT 
  WITH CHECK (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id));

CREATE POLICY "Users can update components of their projects" 
  ON components FOR UPDATE 
  USING (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id));

CREATE POLICY "Users can delete components of their projects" 
  ON components FOR DELETE 
  USING (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id));

-- Similar policies for deployments and github_repositories tables
```

## Build Process

1. Install dependencies:

```bash
npm ci
```

2. Build the application:

```bash
npm run build
```

3. Verify the build:

```bash
npm run start
```

## Deployment Options

### Option 1: Netlify Deployment

1. Create a `netlify.toml` file:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "16"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Deploy to Netlify:

```bash
npx netlify-cli deploy --prod
```

### Option 2: Vercel Deployment

1. Create a `vercel.json` file:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

2. Deploy to Vercel:

```bash
npx vercel --prod
```

### Option 3: Docker Deployment

1. Create a `Dockerfile`:

```dockerfile
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:16-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

2. Build and run the Docker container:

```bash
docker build -t ai-website-builder .
docker run -p 3000:3000 --env-file .env.production ai-website-builder
```

## Post-Deployment Verification

After deployment, verify the following:

1. User authentication works correctly
2. Project creation and management functions properly
3. AI code generation produces expected results
4. GitHub integration creates repositories and commits code
5. Netlify integration creates sites and deploys projects
6. Dashboard displays correct information
7. Error handling works as expected

## Monitoring Setup

1. Set up application monitoring:

```bash
# Install monitoring dependencies
npm install --save @sentry/nextjs

# Initialize Sentry
npx @sentry/wizard -i nextjs
```

2. Configure logging:

```javascript
// In next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

const moduleExports = {
  // Your existing config
};

const SentryWebpackPluginOptions = {
  // Additional config options for the Sentry webpack plugin
};

module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
```

## Backup and Recovery

1. Set up database backups in Supabase:
   - Enable point-in-time recovery
   - Schedule daily backups

2. Create a backup strategy for application code:
   - Maintain versioned releases in GitHub
   - Document the deployment process for each release

## Scaling Considerations

1. Configure auto-scaling if using cloud providers
2. Set up a CDN for static assets
3. Implement caching strategies for API responses
4. Consider database read replicas for high traffic

## Security Checklist

Before going live, verify:

1. All environment variables are properly set
2. Authentication is working correctly
3. Authorization policies are enforced
4. API endpoints are protected
5. CORS is properly configured
6. CSP headers are set
7. Rate limiting is implemented
8. Input validation is in place

## Rollback Plan

In case of deployment issues:

1. Identify the problem through monitoring and logs
2. Revert to the previous stable version:
   ```bash
   git checkout previous-tag
   npm ci
   npm run build
   # Redeploy using your chosen method
   ```
3. Restore database from backup if necessary
4. Notify users of the temporary issue and resolution

## Maintenance Schedule

Establish a regular maintenance schedule:

1. Weekly dependency updates
2. Monthly security audits
3. Quarterly performance reviews
4. Bi-annual penetration testing
